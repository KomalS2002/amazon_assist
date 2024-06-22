import React, { useState } from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ResultCard from '../../components/resultcard/Resultcard';
import Loader from '../../components/loader/Loader';
import './VideoSearch.css';

const VideoSearch = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [detectedItems, setDetectedItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please select a video');
      return;
    }

    const formData = new FormData();
    formData.append('file', videoFile);

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/assist/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      const itemsArray = Object.keys(data).map((key) => ({
        name: key,
        tags: data[key].tags.split(', '), // Split tags into an array
        image_link: data[key].image_link,
      }));

      setDetectedItems(itemsArray);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error uploading video:', error);
      setLoading(false);
      setError('Error uploading video');
    }
  };

  return (
    <div>
      <div className='header'>
      <a href='/home'><img className='logo' src="/logo.svg" alt="logo" /></a>
        <h3>Video Search</h3>
        <SearchIcon style={{ fontSize: '38px' }} />
      </div>
      <div className='wrapper'>
        <div className='upload'>
          <div className='holder'>Upload Video</div>
          <form className='formArea' onSubmit={handleSubmit}>
            <input
              type='file'
              accept='video/*'
              onChange={handleVideoChange}
              className='fileInput'
            />
            <button type='submit' className='submitButton'>Submit</button>
          </form>
          {videoFile && (
            <div className='videoPreview'>
              <video className='video' controls>
                <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {error && (
            <div className='error'>
              <strong>{error}</strong>
            </div>
          )}
        </div>
        <div className='result'>
          <div className='holder'>Detected Items</div>
          <div className='resultsWrap'>
            {loading ? (
              <Loader />
            ) : (
              detectedItems.length > 0 ? (
                detectedItems.map((item, index) => (
                  <ResultCard key={index} item={item} />
                ))
              ) : (
                <p>No items detected.</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSearch;
