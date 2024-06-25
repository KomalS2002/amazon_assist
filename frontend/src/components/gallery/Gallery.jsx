import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://127.0.0.1:8000/history/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        if (response.data === "No items found") {
          setImages([]);
        } else {
          setImages(response.data || []); 
        }
      }
      catch (error) {
        if (error.response) {
          setError('Failed to fetch images.');
        } else if (error.request) {
          setError('Network error. Please try again.');
        } else {
          setError('Error: ' + error.message);
        }
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="image-gallery">
      {error && <p className="error-message">{error}</p>}
      {!error && images.length === 0 && <p>No images found.</p>}
      <div className="image-grid">
        {images.map((link, index,item_name) => (
          <div key={index} className="image-item">
            <img src={link.link} alt={item_name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
