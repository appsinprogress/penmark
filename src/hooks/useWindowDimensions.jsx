import React, { useState, useEffect } from 'react';

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener("resize", handleResize);
  
      window.visualViewport.addEventListener("resize", handleResize);
      return () => {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.removeEventListener("resize", handleResize);
       }   
    }, []);
  
    return windowDimensions;
  }

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    const visualViewportWidth = window.visualViewport.width;
    const visualViewportHeight = window.visualViewport.height;
    return {
        visualViewportWidth: visualViewportWidth,
        visualViewportHeight: visualViewportHeight,
      width,
      height
    };
  }