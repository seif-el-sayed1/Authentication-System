const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
const transporter = require("../config/nodemailer")
const users = require("../models/users")
const {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} = require("../config/emailTemplates")

const register = async (req, res) => {
    const {name, email, password} = req.body
    
    try {
        const existUser = await users.findOne({email: email})        
        if(!name || !email || !password) {
            return res.json({Success: false, message: "name,email and password are required"})
        }

        if(existUser) {
            return res.json({Success: false, message: "User Already Exist"})
        }
        if(!validator.isEmail(email)) {
            return res.json({Success: false, message: "Invalid email"})
        }
        // if(!validator.isStrongPassword(password)) {
        //     return res.json({Success: false, message: "Please Enter Strong Password"})
        // }
        
        const hashPassword = await bcrypt.hash(password, 10)
        
        const user = new users({
            name,
            email, 
            password: hashPassword
        })
        await user.save()
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5m'})
        res.cookie('token', token, {maxAge:120000, httpOnly:true, secure:true, sameSite:"strict"})

        return res.json({Success: true, message: "Sign Up successfully"})
    } catch(error) {
        return res.json({Success: false, message: error.message})
    }
}
const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await users.findOne({email: email})
        if(!email || !password) {
            return res.json({Success: false, message: "email and password are required"})
        }
        if(!user) {
            return res.json({Success: false, message: "User not found"})
        }

        const truePassword = await bcrypt.compare(password, user.password)
        if(!truePassword) {
            return res.json({Success: false, message: "Wrong Password"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '5m'})
        res.cookie('token', token, {maxAge:120000, httpOnly:true, secure:true, sameSite:"strict"})

        return res.json({Success: true, message: "logged in successfully"})
    } catch (error) {
        return res.json({Success: false, message: error.message})
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {httpOnly:true, secure:true, sameSite:"strict"})
        return res.json({Success: true, message: "logged Out"})
    } catch (error) {
        return res.json({Success: false, message: error.message})
    }
}

const sendVerifyOtp = async (req, res) => {
    try {
        const user = await users.findById(req.user.id)
        if(user.isVerified) {
            return res.json({Success: false, message: "Email Already Verified"})
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp
        user.verifyOtpExpired = Date.now() + 24 * 60 * 60 * 1000      
        await user.save()
        
        const mailOption = {
            from: process.env.EMAIL_SENDER,
            to: user.email, 
            subject: "Verify Your Email",
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOption)

        return res.json({Success: true, message: "Verification Otp Sent , Check Your Email"})
    } catch (error) {
        return res.json({Success: false, message: error.message})
    }
}

const verifyEmail = async(req, res) => {
    const {otp} = req.body
    try {
        const user = await users.findById(req.user.id)
        if(!otp) {
            return res.json({Success: false, message: "Please Enter The Otp"})
        }
        if(user.verifyOtp != otp || user.verifyOtpExpired < Date.now()) {
            return res.json({Success: false, message: "Invalid Otp"})
        }

        user.isVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpired = 0
        await user.save()
        return res.json({Success: true, message: "Verified Email Successfully"})
    } catch (error) {
        return res.json({Success: false, message: error.message})
    }
}
const sendResetOtp = async (req, res) => {
    const {email} = req.body
    try {
        const user = await users.findOne({email})
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        if(!user) {
            return res.json({Success: false, message: "Email not Found"})
        }
        user.resetOtp = otp
        user.resetOtpExpired = Date.now() + 24 * 60 * 60 * 1000      
        await user.save()

        const mailOption = {
            from: process.env.EMAIL_SENDER,
            to: email, 
            subject: "Reset Your Password",
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOption)

        return res.json({Success: true, message: "Reset Otp sent , Check Your Email"})
    } catch (error) {
        return res.json({Success: false, message: error.message})
    }
}
const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body
    try {
        const user = await users.findOne({email})
        if(!otp || !newPassword) {
            return res.json({Success: false, message: "otp, newPassword are required"})
        }
        if(user.resetOtp != otp || user.resetOtpExpired < Date.now()) {
            return res.json({Success: false, message: "Invalid Otp"})
        }
        const hashNewPassword = await bcrypt.hash(newPassword, 10)
        const samePassword = await bcrypt.compare(newPassword, user.password)
        if(samePassword) {
            return res.json({Success: false, message: 'The Password is already used'})
        }
        user.password = hashNewPassword
        user.resetOtp = ""
        user.resetOtpExpired = 0    
        await user.save()

        return res.json({Success: true, message: "Reset Password Successfully"})
    } catch (error) {
        return res.json({Success: false, message: error.message})
    }
}

const userData = async (req, res) => {
    try {
        const user = await users.findById(req.user.id)
        if(!user) {
            return res.json({Success: false, message: "User not found"})
        }
    
        return res.json({Success: true, userData: user})
        
        
    } catch (error) {
        return res.json({Success: false, message: error.message})
    }
}

const isAuthenticated = async (req, res) => {
    try {
        return res.json({Success: true})
    } catch(error) {
        return res.json({Success: false, message: error.message})
    }
}

module.exports = {
    register,
    login,
    logout, 
    sendVerifyOtp,
    verifyEmail,
    sendResetOtp,
    resetPassword,
    userData,
    isAuthenticated
}