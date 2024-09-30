import React, { useRef, useEffect } from 'react';
import WaveformVis from './WaveformVis';


const WaveBubbles = () => {
    const waveformRef = useRef(null);
    const shapesRef = useRef(null);

    useEffect(() => {
        const waveformWidth = waveformRef.current.offsetWidth;
        // Use the waveformWidth to create an area to render shapes
        // You can manipulate the shapesRef.current element here
    }, []);

    return (
        <div>
            <WaveformVis ref={waveformRef} />
            <div ref={shapesRef}></div>
        </div>
    );
};

export default WaveBubbles;