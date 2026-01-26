import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
    return (
        <Link to={`/video/${video._id}`} className="video-card">
            <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail" />
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    backgroundColor: '#3f51b5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    {video.uploader?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '500', 
                        lineHeight: '1.4', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden' 
                    }}>
                        {video.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#aaaaaa', marginTop: '4px' }}>
                        {video.channelId?.channelName}
                    </p>
                    <p style={{ fontSize: '14px', color: '#aaaaaa' }}>
                        {video.views} views • {new Date(video.uploadDate).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;
