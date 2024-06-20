import React, { useState } from 'react';
import axios from 'axios';
import './ImageSearch.css';
import SearchIcon from '@mui/icons-material/Search';
import ResultCard from '../../components/resultcard/Resultcard';

const ImageSearch = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedItems, setDetectedItems] = useState([]);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post('http://127.0.0.1:8000/assist/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const products = response.data || [];
      setDetectedItems(products);
      setError(null);
    } catch (error) {
      console.error('Error posting image:', error);
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      setError('Error posting image');
    }
  };

  return (
    <div>
      <div className='header'>
        <img className='logo' src="/logo.svg" alt="logo" />
        <h3>Image Search</h3>
        <SearchIcon style={{ fontSize: '38px' }} />
      </div>
      <div className='wrapper'>
        <div className='upload'>
          <div className='holder'>Upload Image</div>
          <form className='formArea' onSubmit={handleSubmit}>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='fileInput'
            />
            <button type='submit' className='submitButton'>Submit</button>
          </form>
          {selectedImage && (
            <div className='imagePreview'>
              <strong>Selected Image:</strong>
              <img
                className='image'
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
              />
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
            {detectedItems.length > 0 ? (
              detectedItems.map((item, index) => (
                <ResultCard key={index} item={item} />
              ))
            ) : (
              <p>No items detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSearch;
