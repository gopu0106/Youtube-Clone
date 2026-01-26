import React from 'react';
import { Link } from 'react-router-dom';
import { formatViews, formatTimeAgo } from '../utils/format';

const VideoCard = ({ video }) => {
    return (
        <Link to={`/video/${video._id}`} className="video-card">
            <div className="video-thumbnail-container">
                <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail" />
                <div className="duration-badge">{video.duration || '12:45'}</div>
            </div>
            <div className="video-info">
                <div className="video-avatar">
                    {video.uploader?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="video-title">{video.title}</h3>
                    <div className="video-meta">
                        <p>{video.channelId?.channelName}</p>
                        <p>{formatViews(video.views)} views • {formatTimeAgo(video.uploadDate)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;
