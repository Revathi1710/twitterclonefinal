
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRoute from './Routes/auth.route.js';
import nodificationRoute from './Routes/nodification.route.js';
import connectDb from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/user.route.js";
import cloudinary from 'cloudinary';
import Postrouter from "./Routes/post.route.js";
import path from 'path';
import cors from 'cors';
const app = express();
const _dirname=path.resolve();       
app.use(cookieParser());
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.urlencoded({
    extended:true
}))

const PORT=process.env.PORT;
app.use(express.json({
    limit :"5mb"
}));
app.use("/api/auth",authRoute);
app.use("/api/user",userRouter);
app.use('/api/post',Postrouter);
app.use("/api/nodifications",nodificationRoute)

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(
      path.join(_dirname, "twitter-frondend", "dist")
    )
  );

  app.use((req, res) => {
    res.sendFile(
      path.join(_dirname, "twitter-frondend", "dist", "index.html")
    );
  });
}


app.listen(PORT,()=>
{
    console.log(`Server started ${PORT}`);
    connectDb();
})