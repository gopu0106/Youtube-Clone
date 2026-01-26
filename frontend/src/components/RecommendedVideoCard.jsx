import React from 'react';
import { Link } from 'react-router-dom';
import { formatViews, formatTimeAgo } from '../utils/format';

const RecommendedVideoCard = ({ video }) => {
    return (
        <Link to={`/video/${video._id}`} style={{ display: 'flex', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '168px', flexShrink: 0, aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', position: 'relative' }}>
                <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="duration-badge" style={{ bottom: '4px', right: '4px', fontSize: '11px', padding: '1px 3px' }}>{video.duration || '12:45'}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    lineHeight: '1.4', 
                    color: 'var(--text-primary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {video.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '500' }}>{video.channelId?.channelName}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {formatViews(video.views)} views • {formatTimeAgo(video.uploadDate)}
                </p>
            </div>
        </Link>
    );
};

export default RecommendedVideoCard;
