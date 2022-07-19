import Head from 'next/head'
import axios from 'axios'
import { useState } from 'react'
import {saveAs} from 'file-saver'

export default function Home() {
  const [selected, setSelected] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const i = e.target.files[0];
      
      let reader = new FileReader()
      reader.onload = () => {
        let base64String = reader.result
        setSelected(base64String)
      }
      reader.readAsDataURL(i)
    }
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault()

    try {
      const body = JSON.stringify(selected)

      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      const response = await axios.post('/.netlify/functions/cloudinary', body, config)

      const { data } = await response.data
      setVideoUrl(data)
      console.log(data)
      e.target.files = ''
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1 className='text-3xl font-serif font-bold text-center py-5'>
        Video transcription with cloudinary
        </h1>
      </header>
      <main className='container flex justify-center flex-col'>
        <section className='mb-5' id='form-section'>
          <form onSubmit={handleSubmit} className="flex justify-center" >
            <label className="block">
                <span className="text-gray-700">Choose your video file</span>
                <input type="file" onChange={handleChange} className="mt-1 block w-full" required />
            </label>
            <button type='submit' className='px-2 py-0 bg-slate-700 text-gray-50 w-100 h-10 rounded-sm' >Upload</button>
          </form>
        </section>
        <section id="video-output" className='w-full flex justify-center
        '>
          {
            videoUrl? 
            <div className='p-5 flex justify-center flex-col'>
              <div>
                <video controls width={480} className='mb-5 w-100'>
                  <source src={`${videoUrl}.webm`} type='video/webm'/>
                  <source src={`${videoUrl}.mp4`} type='video/mp4'/>
                  <source src={`${videoUrl}.ogv`} type='video/ogg'/>
                </video>
              </div>
              <button 
              onClick={() => { 
              saveAs(videoUrl, "transcribed-video"); 
              setDownloaded(true)}}
              disabled={downloaded? true: false}
              className={downloaded? 'px-2 py-0 bg-slate-300 text-gray-50 w-100 h-10 rounded-sm': 'px-2 py-0 bg-slate-700 text-gray-50 w-100 h-10 rounded-sm'}
              >
                {downloaded? 'Downloaded': 'Download'}
              </button>
            </div> : 
            <p className='text-center text-2xl text-gray-500'>Please Upload a Video file to be Transcribed</p>
          }
        </section>
      </main>
    </div>
  )
}
