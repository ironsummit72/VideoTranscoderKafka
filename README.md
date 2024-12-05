## VideoTranscoderKafka

 This is a very basic express app which has two services one is Upload Service and A Transcoder Service which will transcode the uploaded video 
 The Upload Service will produce an event using apache kafka after the Video is done uploading the the Video Transcoder will consume the event (Kafka event) and starts a transcoding the video using ffmpeg 
 Make sure you have ffmpeg installed in your machine in order to run the transcoder service. 

Requirement 
- Apache Kafka
- Node Js
- ffmpeg

Installation
Step 1 Setup the uploadService
```bash
cd VideoTranscoderKafka
cd UploadService
cp .env.sample .env
npm install
npm start
```
Step 2 Setup the videoTranscoderService
```bash
cd VideoTranscoderKafka
cd videoTranscoderService
cp .env.sample .env
npm install
npm start
```
Now you can upload a video On 

 `POST` `http://localhost:3001/upload` fieldname is `video`

the final output of the video will be found on `videoTranscoderService/output`







 
