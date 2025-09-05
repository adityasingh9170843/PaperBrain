import express from "express";
import { indexTheDocument } from "./prepare.js";
import path from "path";
import fs from "fs";
import multer from "multer";

const app = express();

const upload = multer({dest: 'uploads/'});


app.post('/upload',upload.single.single("pdf"),async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).send("No file uploaded");
        }

        const filePath = path.join("uploads",req.file.filename);
        await indexTheDocument(filePath);
        res.status(200).send("File uploaded and indexed successfully");
    }catch(err){
        console.log(err);
        res.status(500).send("Error uploading file");
    }
})





app.listen(3000, () => {
    console.log('Server is running on port 3000');
});