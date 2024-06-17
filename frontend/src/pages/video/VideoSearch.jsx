import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Resultcard from '../../components/resultcard/Resultcard';

const VideoSearch = () => {
  return (
    <div>
      <div className='header'>
        <img className='logo' src="/logo.svg" alt="logo"/>
        <h3>Video Search</h3>
        <SearchIcon style={{ fontSize: '38px' }}/>
      </div>
      <div className='wrapper'>
        <div className='upload'>
            <div className='holder'>Uploaded Video</div>
            <img className='image' src="" alt="" />
        </div>
        <div className='result'>
            <div className='holder'>Detected Items</div>
            <div className='resultsWrap'>
            <Resultcard/>
            <Resultcard/>
            <Resultcard/>
            <Resultcard/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default VideoSearch
