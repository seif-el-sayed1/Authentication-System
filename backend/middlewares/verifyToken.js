const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
    const {token} = req.cookies
    try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = user
    next()
    } catch (error) {
        return res.json({Success: false, message: "invalid Token"})
    }
}
module.exports = verifyToken
