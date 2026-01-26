import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';

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

    if (!video) return <div style={{ padding: '20px' }}>Loading...</div>;

    const isLiked = video.likes?.includes(user?._id);
    const isDisliked = video.dislikes?.includes(user?._id);

    return (
        <div style={{ display: 'flex', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ flex: 1 }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden' }}>
                    <video 
                        src={video.videoUrl} 
                        controls 
                        autoPlay 
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
                <h1 style={{ fontSize: '20px', marginTop: '12px', fontWeight: 'bold' }}>{video.title}</h1>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3f51b5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {video.uploader?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 style={{ fontWeight: 'bold' }}>{video.channelId?.channelName}</h4>
                            <p style={{ fontSize: '12px', color: '#aaaaaa' }}>{video.channelId?.subscribers?.length || 0} subscribers</p>
                        </div>
                        <button style={{ backgroundColor: 'white', color: 'black', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', marginLeft: '12px' }}>
                            Subscribe
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ display: 'flex', backgroundColor: '#272727', borderRadius: '20px', overflow: 'hidden' }}>
                            <button 
                                onClick={handleLike}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRight: '1px solid #3f3f3f', color: isLiked ? '#3ea6ff' : 'white' }}
                            >
                                <ThumbsUp size={20} fill={isLiked ? '#3ea6ff' : 'none'} /> {video.likes?.length || 0}
                            </button>
                            <button 
                                onClick={handleDislike}
                                style={{ padding: '8px 16px', color: isDisliked ? '#3ea6ff' : 'white' }}
                            >
                                <ThumbsDown size={20} fill={isDisliked ? '#3ea6ff' : 'none'} />
                            </button>
                        </div>
                        <button style={{ backgroundColor: '#272727', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Share2 size={20} /> Share
                        </button>
                    </div>
                </div>

                <div style={{ backgroundColor: '#272727', padding: '12px', borderRadius: '12px', marginTop: '16px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{video.views} views  {new Date(video.uploadDate).toLocaleDateString()}</p>
                    <p style={{ marginTop: '8px', fontSize: '14px', whiteSpace: 'pre-wrap' }}>{video.description}</p>
                </div>

                <div style={{ marginTop: '24px' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>{comments.length} Comments</h3>
                    {user && (
                        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#3f51b5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <input 
                                    type="text" 
                                    placeholder="Add a comment..." 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #3f3f3f', color: 'white', padding: '8px 0', outline: 'none' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setNewComment('')}>Cancel</button>
                                    <button 
                                        type="submit" 
                                        disabled={!newComment.trim()}
                                        style={{ backgroundColor: '#3ea6ff', color: 'black', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', opacity: newComment.trim() ? 1 : 0.5 }}
                                    >
                                        Comment
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {comments.map(comment => (
                            <div key={comment._id} style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {comment.userId?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p style={{ fontSize: '13px', fontWeight: 'bold' }}>
                                            @{comment.userId?.username} <span style={{ fontWeight: 'normal', color: '#aaaaaa', marginLeft: '4px' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </p>
                                        {user && user._id === comment.userId?._id && (
                                            <button onClick={() => handleDeleteComment(comment._id)} style={{ color: '#aaaaaa' }}><MoreHorizontal size={16} /></button>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '14px', marginTop: '4px' }}>{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div style={{ width: '400px' }}>
                <h4 style={{ marginBottom: '16px' }}>Related Videos</h4>
                <p style={{ color: '#aaaaaa' }}>Coming soon...</p>
            </div>
        </div>
    );
};

export default VideoPlayer;
