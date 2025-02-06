require('dotenv').config(); 
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const userRouter = require('./router/userRouter');
const cookieParser = require('cookie-parser');

app.use(express.json())
const allowedOrigins = ["http://localhost:5173"] 
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(cookieParser())


app.use("/api", userRouter)

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Mongo DB Connected');
})

app.listen(process.env.PORT || 3000, () => {
    console.log('listen on ' + (process.env.PORT || 3000));
    
}) 