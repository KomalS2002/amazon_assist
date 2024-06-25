import React from 'react';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import Gallery from '../../components/gallery/Gallery';
import { useNavigate } from 'react-router-dom';
import './Home.css';

let options = [
  {
    icon: <DescriptionIcon style={{ fontSize: '60px', color: '#f3830c' }} />,
    title: "Text Search",
    desc: "Describe product to search it",
    path: "/home/text"
  },
  {
    icon: <ImageSearchIcon style={{ fontSize: '60px', color: '#f3830c' }}/>,
    title: "Image Search",
    desc: "Upload an image to search product in the image",
    path: "/home/image"
  },
  {
    icon: <VideoSettingsIcon style={{ fontSize: '60px', color: '#f3830c' }}/>,
    title: "Video Search",
    desc: "Upload a video to search product in the video",
    path: "/home/video"
  }
];

const Home = () => {
  const navigate = useNavigate();

  const handleOptionClick = (path) => {
    navigate(path);
  };
  return (
    <div>
      <div className='header'>
        <img className='logo' src="logo.svg" alt="logo" />
      </div>
      <div className='container'>
        <div className='searchOptions'>
          {options.map(({ icon, title, desc, path }, index) => (
            <div className='option' key={index} onClick={() => handleOptionClick(path)}>
              <div className='icon'>{icon}</div>
              <h2>{title}</h2>
              <p>{desc}</p>
            </div>
          ))}
        </div>
        <div className='history'>
        <h2 style={{ textAlign: 'left' }}>Previously detected item</h2>
          <div className='itemCards'>
            <Gallery/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
