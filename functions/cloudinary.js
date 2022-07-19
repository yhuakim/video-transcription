const Cloudinary = require ('cloudinary').v2
require("dotenv").config();

const handler = async (event) => {
  const path = JSON.parse(event.body);

  try {
    Cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true
    });

    const VideoTranscribe = Cloudinary.uploader.upload(path,
    { resource_type: "video", 
      public_id: "videos/demo-video",
      raw_convert: "google_speech:srt:vtt"
    },
    function (error, result) {
      if (result) {
        console.log(result, error) 
      }
    });

    let {public_id} = await VideoTranscribe

    const transcribedVideo = Cloudinary.url(`${public_id}`, { 
      resource_type: "video",
      loop: false,
      controls: true, 
      autoplay: true, 
      fallback_content: "Your browser does not support HTML5 video tags",
      transformation: [
        {
          overlay: {
            resource_type: "subtitles",
            public_id: `${public_id}.en-US.srt`
          }
        },
        {flags: "layer_apply"}
      ]
    })

    console.log(transcribedVideo)

    return {
      statusCode: 200,
      body: JSON.stringify({ data: transcribedVideo})
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handler
};