import React from 'react';
import './Home.css';

let options = [
  {
    icon: "logo.svg",
    title: "Text Search",
    desc: "lorem ipsum dollar sit amet"
  },
  {
    icon: "logo.svg",
    title: "Image Search",
    desc: "lorem ipsum dollar sit amet"
  },
  {
    icon: "logo.svg",
    title: "Video Search",
    desc: "lorem ipsum dollar sit amet"
  }
];

const Home = () => {
  return (
    <div>
      <div className='header'>
        <img className='logo' src="logo.svg" alt="logo" />
      </div>
      <div className='container'>
        <div className='searchOptions'>
          {options.map(({ icon, title, desc }, index) => (
            <div className='option' key={index}>
              <img src={icon} alt="logo" />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <div className='history'></div>
      </div>
    </div>
  );
}

export default Home;
