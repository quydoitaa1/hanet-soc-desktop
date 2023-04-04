import React, { useState, useEffect, useRef } from 'react';
import { Player } from 'video-react';

export interface VideoState {
    paused: boolean;
    currentTime?: number;
}

interface Props {
    src: string;
    state: VideoState;
    head?: boolean;
    changeState: (state, prevState) => void;
}

const VideoPlayer: React.FC<Props> = ({ src, state, head = false, changeState }) => {
    // const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<any>(null);

    const { paused, currentTime = 0 } = state;
    useEffect(() => {
        if (paused) {
            // setIsPlaying(false);
            videoRef.current?.pause();
        } else {
            videoRef.current?.play();
        }
    }, [paused]);

    useEffect(() => {
        if (head) {
            videoRef.current.subscribeToStateChange(changeState);
        }
    }, []);

    useEffect(() => {
        const { player } = videoRef.current.getState();
        if (player.currentTime !== currentTime) {
            videoRef.current?.seek(currentTime);
        }
    }, [currentTime]);

    return (
        <Player auto autoPlay ref={videoRef} on>
            <source
                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                type="video/mp4"
            />
        </Player>
    );

    // return (
    //     <div>
    //         <video ref={videoRef} autoPlay controls className="video-item-player">
    //             <track kind="captions" />
    //             <source src={src} type="video/mp4" />
    //         </video>
    //     </div>
    // );
};

export default VideoPlayer;
