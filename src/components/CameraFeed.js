import React, { useRef, useEffect } from 'react';

const CameraFeed = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    getVideo();
  }, []);

  return (
    <div className="camera-feed-container">
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }} />
    </div>
  );
};

export default CameraFeed;
