import React from 'react'
import LaunchIcon from '@mui/icons-material/Launch';
import './Resultcard.css'
const Resultcard = () => {
  return (
      <div className='resultCard'>
            <p style={{margin:'5px'}}>Item name</p>
              <img className='resimg' src="/'Mosaic Bird' Photographic Print by dgarden.jpeg" alt="" />
              <button className='btn'>Go to Amazon
              <LaunchIcon/>
              </button>
            </div>
    
  )
}

export default Resultcard
