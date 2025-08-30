import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads')); 
app.use(cors());

app.use(postRoutes);
app.use(userRoutes);


const start = async ()=>{
    const connectDB = await mongoose.connect("mongodb+srv://faisalbinkhurram:faisalbin@linkedinclone.xvbjeyk.mongodb.net/?retryWrites=true&w=majority&appName=LinkedInClone");

    app.listen(8080, ()=>{
        console.log("listiening to port 8080");
    })
};

start();