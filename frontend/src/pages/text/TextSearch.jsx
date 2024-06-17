import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Resultcard from '../../components/resultcard/Resultcard';
import './TextSearch.css'
const TextSearch = () => {
  return (
    <div>
      <div className='header'>
        <img className='logo' src="/logo.svg" alt="logo"/>
        <h3>Text Search</h3>
        <SearchIcon style={{ fontSize: '38px' }}/>
      </div>
      <div className='wrapper'>
        <div className='upload'>
            <div className='holder'>Uploaded Text</div>
            <div className='descr'>
            Modern lamps.These lamps are often more minimalist in design and are perfect for contemporary settings. 
            They can add a touch of style to any room.Table lamps with multiple bulbs. 
            These lamps are great for reading or working in bed.
            <br />
            They provide plenty of light and can be very stylish. Sleek and modern lamps are perfect for those 
            who want a romantic touch without all the frills. 
            <br />
            The simple design is both 
            elegant and inviting, and the warm light it emits is perfect for creating a cozy atmosphere.
            </div>
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

export default TextSearch
