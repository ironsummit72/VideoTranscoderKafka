import express from 'express' 
import { Kafka } from 'kafkajs'
import dotenv from 'dotenv'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
const app=express();
dotenv.config();
const port=process.env.PORT



const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.KAFKA_URL],
})
const consumer = kafka.consumer({ groupId: 'video-group' })

await consumer.connect()
await consumer.subscribe({ topic: 'video', fromBeginning: false })
if(fs.existsSync('./output')===false)
{
  fs.mkdirSync('./output')
}

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
  const messageKafka=message.value.toString();
  const data=JSON.parse(messageKafka)
  console.log(messageKafka);
console.log("resolved path",path.resolve(data.filepath));
fs.mkdir(`./output/${data.filename.replace(/\s+/g, '').split('.')[0]}`,(err)=>{
    if(err) return 
})
 convertToHLS(path.resolve(data.filepath),`./output/${data.filename.replace(/\s+/g, '').split('.')[0]}`)
  },
})


const convertToHLS = (inputFilePath,outputDir) => {
    console.log("started conversion");
    
    const outputPath = path.join(outputDir, 'output.m3u8');
  
    ffmpeg(inputFilePath)
      .outputOptions([
        '-codec: copy',        // Copy existing codecs (no re-encoding for speed)
        '-start_number 0',     // Segment numbering starts at 0
        '-hls_time 10',        // Segment duration (10 seconds)
        '-hls_list_size 0',    // Include all segments in the playlist
        '-f hls',              // Output format: HLS
      ])
      .on('start', (commandLine) => {
        console.log(`FFmpeg process started: ${commandLine}`);
      })
      .on('progress', (progress) => {
        console.log(`Processing: ${Math.round(progress.percent)}% done`);
      })
      .on('error', (err, stdout, stderr) => {
        console.error('Error during processing:', err.message);
        console.error('FFmpeg stderr:', stderr);
      })
      .on('end', () => {
        console.log('HLS conversion completed successfully!');
        fs.unlink(inputFilePath,(err)=>{
          if(err){
            console.error(err,'something wentwrong deleting the file');

          }
          console.log("delete the original file");
        })
      })
      .save(outputPath);
  };
  
app.listen(port,()=>{
    console.log('transcoder service is running on  localhost ',port);  
})