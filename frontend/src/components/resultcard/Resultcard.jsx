import React from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import { updateAmazonUrl } from '../../components/LinkManipulator';
import './Resultcard.css';

const ResultCard = ({ item }) => {
  const imageUrl = item.image_link;
  const amazonUrl = updateAmazonUrl(item.name, item.tags);

  return (
    <div className='resultCard'>
      <p style={{ margin: '5px' }}>{item.name}</p>
      <img className='resimg' src={imageUrl} alt={item.name} />
      <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className='btn' style={{textDecoration: "none"}}>
        Go to Amazon
        <LaunchIcon />
      </a>
    </div>
  );
};

export default ResultCard;
