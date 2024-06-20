
import React from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import './Resultcard.css';

const ResultCard = ({ item }) => {
  const imageUrl = `http://127.0.0.1:8000/${item.image_link}`;
  console.log(imageUrl)
  return (
    <div className='resultCard'>
      <p style={{margin:'5px'}}>{item.name}</p>
      <img className='resimg' src={imageUrl}  alt= " " />
      <button className='btn'>
        Go to Amazon
        <LaunchIcon />
      </button>
      {/* <p>{item.tags}</p>  to be used in search link */} 
    </div>
  );
};

export default ResultCard;
