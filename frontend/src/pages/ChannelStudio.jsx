import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit3, Plus } from 'lucide-react';

const ChannelStudio = () => {
    const { user } = useContext(AuthContext);
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [isCreatingChannel, setIsCreatingChannel] = useState(false);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    
    // Form states
    const [channelForm, setChannelForm] = useState({ channelName: '', description: '' });
    const [videoForm, setVideoForm] = useState({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'Music' });

    const [editingVideo, setEditingVideo] = useState(null);

    useEffect(() => {
        if (user) {
            fetchChannel();
        }
    }, [user]);

    const fetchChannel = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/videos?uploader=${user._id}`);
            setVideos(res.data);
        } catch (error) {
            console.error('Error fetching studio data:', error);
        }
    };

    const handleUpdateVideo = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5001/api/videos/${editingVideo._id}`, videoForm, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setVideos(videos.map(v => v._id === res.data._id ? res.data : v));
            setEditingVideo(null);
            setVideoForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'Music' });
        } catch (error) {
            alert('Error updating video');
        }
    };

    const startEditing = (video) => {
        setEditingVideo(video);
        setVideoForm({
            title: video.title,
            description: video.description,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            category: video.category
        });
    };

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5001/api/channels`, channelForm, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setChannel(res.data);
            setIsCreatingChannel(false);
        } catch (error) {
            alert('Error creating channel');
        }
    };

    const handleUploadVideo = async (e) => {
        e.preventDefault();
        try {
            // We need a channel ID to upload a video
            // For this project, let's assume we create a default channel if none exists
            let activeChannelId = channel?._id;
            if (!activeChannelId) {
                const cRes = await axios.post(`http://localhost:5001/api/channels`, { channelName: `${user.username}'s Channel`, description: 'My first channel' }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                activeChannelId = cRes.data._id;
                setChannel(cRes.data);
            }

            const res = await axios.post(`http://localhost:5001/api/videos`, {
                ...videoForm,
                channelId: activeChannelId
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setVideos([res.data, ...videos]);
            setIsUploadingVideo(false);
            setVideoForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'Music' });
        } catch (error) {
            alert('Error uploading video');
        }
    };

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/videos/${videoId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setVideos(videos.filter(v => v._id !== videoId));
        } catch (error) {
            alert('Error deleting video');
        }
    };

    if (!user) return <div style={{ padding: '20px' }}>Please login to access Studio.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1>Channel Content</h1>
                <button 
                    onClick={() => setIsUploadingVideo(true)}
                    style={{ backgroundColor: '#3ea6ff', color: 'black', padding: '10px 16px', borderRadius: '4px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Plus size={20} /> Create
                </button>
            </div>

            {(isUploadingVideo || editingVideo) && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h2>{editingVideo ? 'Edit Video' : 'Upload Video'}</h2>
                        <form onSubmit={editingVideo ? handleUpdateVideo : handleUploadVideo} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                            <input style={inputStyle} placeholder="Title" value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} required />
                            <textarea style={{...inputStyle, height: '100px'}} placeholder="Description" value={videoForm.description} onChange={e => setVideoForm({...videoForm, description: e.target.value})} required />
                            <input style={inputStyle} placeholder="Video URL (mp4)" value={videoForm.videoUrl} onChange={e => setVideoForm({...videoForm, videoUrl: e.target.value})} disabled={!!editingVideo} required />
                            <input style={inputStyle} placeholder="Thumbnail URL" value={videoForm.thumbnailUrl} onChange={e => setVideoForm({...videoForm, thumbnailUrl: e.target.value})} required />
                            <select style={inputStyle} value={videoForm.category} onChange={e => setVideoForm({...videoForm, category: e.target.value})}>
                                <option value="Music">Music</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Code">Code</option>
                                <option value="News">News</option>
                            </select>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                                <button type="button" onClick={() => { setIsUploadingVideo(false); setEditingVideo(null); }}>Cancel</button>
                                <button type="submit" style={{ backgroundColor: '#3ea6ff', color: 'black', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold' }}>{editingVideo ? 'Update' : 'Upload'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ borderBottom: '1px solid #333', color: '#aaaaaa', fontSize: '14px' }}>
                        <tr>
                            <th style={{ padding: '16px' }}>Video</th>
                            <th style={{ padding: '16px' }}>Date</th>
                            <th style={{ padding: '16px' }}>Views</th>
                            <th style={{ padding: '16px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map(video => (
                            <tr key={video._id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <img src={video.thumbnailUrl} style={{ width: '120px', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{video.title}</div>
                                        <div style={{ fontSize: '12px', color: '#aaaaaa', marginTop: '4px' }}>{video.description.substring(0, 50)}...</div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', fontSize: '14px' }}>{new Date(video.uploadDate).toLocaleDateString()}</td>
                                <td style={{ padding: '16px', fontSize: '14px' }}>{video.views}</td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <button onClick={() => startEditing(video)} style={{ color: '#aaaaaa' }}><Edit3 size={18} /></button>
                                        <button onClick={() => handleDeleteVideo(video._id)} style={{ color: '#aaaaaa' }}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {videos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#aaaaaa' }}>No videos found. Start by uploading one!</div>
                )}
            </div>
        </div>
    );
};

const modalOverlay = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContent = {
    backgroundColor: '#1e1e1e', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '500px', border: '1px solid #333'
};

const inputStyle = {
    padding: '12px', backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: '4px', color: 'white', fontSize: '14px'
};

export default ChannelStudio;
