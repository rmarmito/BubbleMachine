import React, { useState, useEffect } from "react";
import BubbleBox from "../components/BubbleBox";
import { Box } from "@mui/material";
import { Stage, Layer, Ellipse } from 'react-konva'

const BubbleLayer = () => {

  const [stageWidth, setStageWidth] = useState(window.innerWidth);
  const [stageHeight, setStageHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    const handleResize = () => {
      setStageWidth(window.innerWidth);
      setStageHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); 

  return (
    <div>
      <BubbleBox
        label="Now Playing"
        labelColor="#ffc107"
        title="Darude Sandstorm"
        titleColor="white"
      >
        {/* more box content */}
        <Box
          sx={{
            border: 1,
            borderColor: "black",
            borderRadius: "10px",
            backgroundColor: "white",
            p: 5,
          }}
        >
          <Stage width = {window.innerWidth} height ={window.innerHeight/2} >
            <Layer>
              <Ellipse 
                x = {100} 
                y = {window.innerHeight/2}
                width = {200}
                height = {300}
                fill = "Blue"
                stroke = "black" 
              />
              <Ellipse 
                x = {200} 
                y = {window.innerHeight}
                width = {400}
                height = {100}
                fill = "red"
                stroke = "black"  
              />
              <Ellipse 
                x = {400} 
                y = {window.innerHeight}
                width = {400}
                height = {300}
                fill = "blue"
                stroke = "black"  
              />
              <Ellipse 
                x = {600} 
                y = {window.innerHeight}
                width = {500}
                height = {500}
                fill = "green"
                stroke = "black"  
              />
              <Ellipse 
                x = {725} 
                y = {window.innerHeight}
                width = {50}
                height = {100}
                fill = "red"
                stroke = "black"  
              />
              <Ellipse 
                x = {200} 
                y = {window.innerHeight}
                width = {400}
                height = {100}
                fill = "red"
                stroke = "black"  
              />
              {/* Second section */}
              <Ellipse 
                x = {1000} 
                y = {window.innerHeight}
                width = {400}
                height = {300}
                fill = "blue"
                stroke = "black" 
              />
              <Ellipse 
                x = {700} 
                y = {window.innerHeight/2}
                width = {200}
                height = {300}
                fill = "blue"
                stroke = "black"  
              />
              <Ellipse 
                x = {400} 
                y = {window.innerHeight}
                width = {400}
                height = {300}
                fill = "blue"
                stroke = "black"  
              />
              <Ellipse 
                x = {1500} 
                y = {window.innerHeight/2}
                width = {300}
                height = {100}
                fill = "red"
                stroke = "black"  
              />
              <Ellipse 
                x = {1300} 
                y = {window.innerHeight}
                width = {300}
                height = {50}
                fill = "yellow"
                stroke = "black"  
              />
              <Ellipse 
                x = {200} 
                y = {window.innerHeight/2}
                width = {400}
                height = {100}
                fill = "red"
                stroke = "black"  
              />
            </Layer>
          </Stage> 
        </Box>
      </BubbleBox>
    </div>
  );
};

export default BubbleLayer;
