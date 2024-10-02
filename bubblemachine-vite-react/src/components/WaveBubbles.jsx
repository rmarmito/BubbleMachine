import React, { useRef, useEffect, useState } from 'react';
import WaveformVis from './WaveformVis';
import BubbleRender from './BubbleRender';

const WaveBubbles = (bubblesData) => {
    const waveformRef = useRef(null);
    const shapesRef = useRef(null);
    const [audioDuration, setAudioDuration] = useState(0);

    useEffect(() => {
        const waveformWidth = waveformRef.current.offsetWidth;
        // Use the waveformWidth to create an area to render shapes
        // You can manipulate the shapesRef.current element here
    }, []);

    return (
        <>
            <BubbleRender initBubblesData={bubblesData} audioDuration={audioDuration} />
            <WaveformVis    waveformRef={waveformRef}
                            audioDuration={audioDuration}
                            setAudioDuration={setAudioDuration}  /> 
        </>         
    );
};

export default WaveBubbles;