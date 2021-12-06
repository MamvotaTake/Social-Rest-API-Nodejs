const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan")

const  userRouter = require("./routes/user")
const  authRouter = require("./routes/auth")
const  postRouter = require("./routes/post")

dotenv.config()

mongoose.connect(process.env.MONGO_CONN,  ()=>{
    console.log("connected to the MongoDB")
})


//Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("dev"))

app.use('/api/user/', userRouter)
app.use('/api/auth/', authRouter)
app.use('/api/post/', postRouter)


app.listen(8800, ()=>{
    console.log("Backend server is running")
})