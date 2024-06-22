// src/pages/TextSearch/TextSearch.js
import React, { useState } from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ResultCard from '../../components/resultcard/Resultcard';
import Loader from '../../components/loader/Loader';
import './TextSearch.css';

const TextSearch = () => {
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [detectedItems, setDetectedItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedText(inputText);
    console.log(inputText);

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/assist/text', {
        text: inputText,
      });
      console.log('Server response:', response.data);

      // Assuming response.data is in the format { "Modern lamps": { "tags": "...", "image_link": "..." }, ... }
      const products = response.data;
      const itemsArray = Object.keys(products).map((key) => ({
        name: key,
        tags: products[key].tags.split(', '), 
        image_link: products[key].image_link,
      }));

      setDetectedItems(itemsArray);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error posting text:', error);
      if (error.response) {
        console.error('Response error data:', error.response.data); 
      }
      setLoading(false);
      setError('Error posting text');
    }
  };

  return (
    <div>
      <div className='header'>
      <a href='/home'><img className='logo' src="/logo.svg" alt="logo" /></a>
        <h3>Text Search</h3>
        <SearchIcon style={{ fontSize: '38px' }} />
      </div>
      <div className='wrapper'>
        <div className='upload'>
          <div className='holder'>Uploaded Text</div>
          <form className='formArea' onSubmit={handleSubmit}>
            <textarea
              className='textInput'
              value={inputText}
              onChange={handleInputChange}
              placeholder='Enter your text here...'
            ></textarea>
            <button type='submit' className='submitButton'>
              Submit
            </button>
          </form>
          {submittedText && (
            <div className='descr'>
              <p>{submittedText}</p>
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

export default TextSearch;
