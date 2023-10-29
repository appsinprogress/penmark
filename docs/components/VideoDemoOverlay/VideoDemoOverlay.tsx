import YouTube, {YouTubePlayer} from 'react-youtube'; // Import the YouTube component
import useWindowDimensions from './useWindowDimensions';
import { useEffect } from 'react';

let videoElement: YouTubePlayer = null;

const VideoDemoOverlay = ({ active, onClose }) => {
  // CSS class to determine whether the overlay should be visible or hidden
  let { width, height } = useWindowDimensions();

  if(width < 768){
    width = width * 0.9;
    height = height * 0.9;
  } else{
    width = width * 0.8;
    height = height * 0.8;
  }

  if(height > (1080/1920)*width) height = (1080/1920)*width;
  if(width > (1920/1080)*height) width = (1920/1080)*height;  

  const opts = {
    width: width,
    height: height
  };

  //use effect to make the body have no scroll when the overlay is active
  useEffect(() => {
    if(active){
      document.body.style.overflow = 'hidden';
    } else{
      document.body.style.overflow = 'auto';
    }
  }
  ,[active]);

  const _onReady = (event: YouTubePlayer) => {
    videoElement = event;
  };

  return (
    <div 
      onClick={() => {
        //pause the youtube video 
        videoElement.target.pauseVideo();
        onClose();
      }} 
      className={`justify-center items-center flex h-screen w-screen absolute z-20 top-0 bg-black bg-opacity-60 ${active ? 'visible' : 'hidden'}`}
    >
      <YouTube
        opts={opts}
        videoId="BMkvbgiU9ew"
        onReady={_onReady}
      />
    </div>

  );
};

export default VideoDemoOverlay;