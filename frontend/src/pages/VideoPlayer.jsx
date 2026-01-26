import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { formatViews, formatTimeAgo } from '../utils/format';

const VideoPlayer = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const videoRes = await axios.get(`http://localhost:5001/api/videos/${id}`);
                setVideo(videoRes.data);
                const commentsRes = await axios.get(`http://localhost:5001/api/comments/${id}`);
                setComments(commentsRes.data);
            } catch (error) {
                console.error('Error fetching video data:', error);
            }
        };
        fetchVideoData();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to comment');
        try {
            const res = await axios.post(`http://localhost:5001/api/comments`, {
                videoId: id,
                text: newComment
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setComments([res.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleLike = async () => {
        if (!user) return alert('Please login to like');
        try {
            const res = await axios.post(`http://localhost:5001/api/videos/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setVideo(res.data);
        } catch (error) {
            console.error('Error liking video:', error);
        }
    };

    const handleDislike = async () => {
        if (!user) return alert('Please login to dislike');
        try {
            const res = await axios.post(`http://localhost:5001/api/videos/${id}/dislike`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setVideo(res.data);
        } catch (error) {
            console.error('Error disliking video:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:5001/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setComments(comments.filter(c => c._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (!video) return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading...</div>;

    const isLiked = video.likes?.includes(user?._id);
    const isDisliked = video.dislikes?.includes(user?._id);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', gap: '24px', maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}
        >
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                    <video 
                        src={video.videoUrl} 
                        controls 
                        autoPlay 
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
                <h1 style={{ fontSize: '20px', marginTop: '16px', fontWeight: '700', lineHeight: '28px' }}>{video.title}</h1>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '600', border: '1px solid var(--glass-border)' }}>
                            {video.uploader?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '600', fontSize: '16px' }}>{video.channelId?.channelName}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{video.channelId?.subscribers?.length || 0} subscribers</p>
                        </div>
                        <button className="btn btn-primary" style={{ marginLeft: '12px' }}>
                            Subscribe
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                            <button 
                                onClick={handleLike}
                                className="btn-ghost"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRight: '1px solid var(--glass-border)', color: isLiked ? '#3ea6ff' : 'inherit' }}
                            >
                                <ThumbsUp size={20} fill={isLiked ? '#3ea6ff' : 'none'} /> 
                                <span style={{ fontSize: '14px', fontWeight: '600' }}>{video.likes?.length || 0}</span>
                            </button>
                            <button 
                                onClick={handleDislike}
                                className="btn-ghost"
                                style={{ padding: '8px 16px', color: isDisliked ? '#3ea6ff' : 'inherit' }}
                            >
                                <ThumbsDown size={20} fill={isDisliked ? '#3ea6ff' : 'none'} />
                            </button>
                        </div>
                        <button className="btn btn-ghost" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                            <Share2 size={20} /> 
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>Share</span>
                        </button>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-lg)', marginTop: '16px', border: '1px solid var(--glass-border)' }}>
                    <p style={{ fontWeight: '700', fontSize: '14px' }}>{formatViews(video.views)} views • {formatTimeAgo(video.uploadDate)}</p>
                    <p style={{ marginTop: '8px', fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '20px' }}>{video.description}</p>
                </div>

                <div style={{ marginTop: '24px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '24px', fontWeight: '700' }}>{comments.length} Comments</h3>
                    {user && (
                        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--glass-border)' }}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <input 
                                    type="text" 
                                    placeholder="Add a comment..." 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', borderRadius: 0, padding: '8px 0', fontSize: '14px' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                                    <button type="button" className="btn btn-ghost" onClick={() => setNewComment('')}>Cancel</button>
                                    <button 
                                        type="submit" 
                                        disabled={!newComment.trim()}
                                        className="btn btn-accent"
                                        style={{ padding: '8px 16px', opacity: newComment.trim() ? 1 : 0.5 }}
                                    >
                                        Comment
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {comments.map(comment => (
                            <div key={comment._id} style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--glass-border)', fontSize: '14px', fontWeight: '600' }}>
                                    {comment.userId?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <p style={{ fontSize: '13px', fontWeight: '700' }}>
                                                @{comment.userId?.username} <span style={{ fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '8px' }}>{formatTimeAgo(comment.createdAt)}</span>
                                            </p>
                                            <p style={{ fontSize: '14px', marginTop: '4px', lineHeight: '20px' }}>{comment.text}</p>
                                        </div>
                                        {user && user._id === comment.userId?._id && (
                                            <button onClick={() => handleDeleteComment(comment._id)} className="btn-icon" style={{ color: 'var(--text-secondary)' }}>
                                                <MoreHorizontal size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontWeight: '700', fontSize: '16px' }}>Related Videos</h4>
                <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-secondary)', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>More videos coming soon...</p>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoPlayer;
