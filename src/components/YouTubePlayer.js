import React from 'react';
import YouTube from 'react-youtube';

const YouTubePlayer = ({ videoId, onReady, onEnd }) => {
    const opts = {
        height: '360',
        width: '640',
        playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0
        }
    };

    return (
        <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            onEnd={onEnd}
            className="youtube-player"
        />
    );
};

export default YouTubePlayer; 