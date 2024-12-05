import express from 'express';
import dotenv from 'dotenv'
import { Kafka } from 'kafkajs';
import upload from './middleware/multer.middleware.js';
dotenv.config()
const app=express();
const port=process.env.PORT

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [process.env.KAFKA_URL],
  })
app.post('/upload',upload.array('video'),async(req,res)=>{
const producer = kafka.producer()
await producer.connect()
req.files.forEach(async element => {
  await producer.send({
    topic: 'video',
    messages: [
      { value: JSON.stringify({filename:element.filename,filepath:element.path}) },
    ],
  })
});
    console.log(req.file);
    res.send("video upload success")
})
app.listen(port,()=>{
    console.log("upload service listening on port",port);
    
})