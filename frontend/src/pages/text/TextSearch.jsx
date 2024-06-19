import React, { useState } from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import Resultcard from '../../components/resultcard/Resultcard';
import './TextSearch.css';

const TextSearch = () => {
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [detectedItems, setDetectedItems] = useState([]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedText(inputText);
    console.log(inputText);
    try {
      const response = await axios.post('http://127.0.0.1:8000/assist/text/', {
      "text": inputText
       
      });
      setDetectedItems(response.data.products);
    } catch (error) {
      console.error('Error posting text:', error);
    }
  };

  return (
    <div>
      <div className='header'>
        <img className='logo' src="/logo.svg" alt="logo" />
        <h3>Text Search</h3>
        <SearchIcon style={{ fontSize: '38px' }} />
      </div>
      <div className='wrapper'>
        <div className='upload'>
          <div className='holder'>Upload Text</div>
          <form className='formArea' onSubmit={handleSubmit}>
            <textarea
              className='textInput'
              value={inputText}
              onChange={handleInputChange}
              placeholder='Enter your text here...'
            ></textarea>
            <button type='submit' className='submitButton'>Submit</button>
          </form>
          {submittedText && (
            <div className='descr'>
              <p>{submittedText}</p>
            </div>
          )}
        </div>
        <div className='result'>
          <div className='holder'>Detected Items</div>
          <div className='resultsWrap'>
            {detectedItems.length > 0 ? (
              detectedItems.map((item, index) => (
                <Resultcard key={index} item={item} />
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

export default TextSearch;
