import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit3, Plus } from 'lucide-react';
import { formatViews } from '../utils/format';

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

    if (!user) return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Please login to access Studio.</div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700' }}>Channel Analytics</h1>
                <button 
                    onClick={() => setIsUploadingVideo(true)}
                    className="btn btn-accent"
                >
                    <Plus size={20} /> <span style={{ marginLeft: '4px' }}>Create</span>
                </button>
            </div>

            <AnimatePresence>
                {(isUploadingVideo || editingVideo) && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={modalOverlay}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="input-glass" 
                            style={modalStyle}
                        >
                            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>{editingVideo ? 'Edit details' : 'Upload video'}</h2>
                            <form onSubmit={editingVideo ? handleUpdateVideo : handleUploadVideo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <input placeholder="Title (required)" value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} required />
                                <textarea 
                                    style={{ 
                                        width: '100%', 
                                        backgroundColor: 'var(--bg-secondary)', 
                                        border: '1px solid var(--glass-border)', 
                                        borderRadius: 'var(--radius-md)', 
                                        padding: '12px', 
                                        color: 'white', 
                                        minHeight: '120px',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }} 
                                    placeholder="Description" 
                                    value={videoForm.description} 
                                    onChange={e => setVideoForm({...videoForm, description: e.target.value})} 
                                    required 
                                />
                                <input placeholder="Video URL (mp4)" value={videoForm.videoUrl} onChange={e => setVideoForm({...videoForm, videoUrl: e.target.value})} disabled={!!editingVideo} required />
                                <input placeholder="Thumbnail URL" value={videoForm.thumbnailUrl} onChange={e => setVideoForm({...videoForm, thumbnailUrl: e.target.value})} required />
                                <select 
                                    style={{ 
                                        width: '100%', 
                                        backgroundColor: 'var(--bg-secondary)', 
                                        border: '1px solid var(--glass-border)', 
                                        padding: '10px', 
                                        borderRadius: 'var(--radius-md)', 
                                        color: 'white',
                                        outline: 'none'
                                    }} 
                                    value={videoForm.category} 
                                    onChange={e => setVideoForm({...videoForm, category: e.target.value})}
                                >
                                    <option value="Music">Music</option>
                                    <option value="Gaming">Gaming</option>
                                    <option value="Code">Code</option>
                                    <option value="News">News</option>
                                </select>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                                    <button type="button" className="btn btn-ghost" onClick={() => { setIsUploadingVideo(false); setEditingVideo(null); }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingVideo ? 'Save Changes' : 'Upload'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="input-glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Videos</p>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>{videos.length}</h3>
                </div>
                <div className="input-glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Views</p>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>{formatViews(videos.reduce((acc, v) => acc + (v.views || 0), 0))}</h3>
                </div>
                <div className="input-glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Subscribers</p>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>{formatViews(channel?.subscribers?.length || 0)}</h3>
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-md)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <tr>
                            <th style={{ padding: '16px 24px' }}>Video</th>
                            <th style={{ padding: '16px 24px' }}>Date</th>
                            <th style={{ padding: '16px 24px' }}>Views</th>
                            <th style={{ padding: '16px 24px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map(video => (
                            <tr key={video._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background-color 0.2s' }} className="table-row-hover">
                                <td style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <img src={video.thumbnailUrl} style={{ width: '120px', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }} alt="" />
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{video.description.substring(0, 50)}...</div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>{new Date(video.uploadDate).toLocaleDateString()}</td>
                                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{video.views}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => startEditing(video)} className="btn-icon" style={{ color: 'var(--text-secondary)' }}><Edit3 size={18} /></button>
                                        <button onClick={() => handleDeleteVideo(video._id)} className="btn-icon" style={{ color: 'var(--text-secondary)' }}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {videos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 40px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '500' }}>No content available</div>
                        <p style={{ marginTop: '8px', fontSize: '14px' }}>Upload your first video to get started!</p>
                    </div>
                )}
            </div>
            <style>{`
                .table-row-hover:hover {
                    background-color: var(--bg-tertiary);
                }
            `}</style>
        </motion.div>
    );
};

const modalOverlay = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    backdropFilter: 'blur(4px)'
};

const modalStyle = {
    padding: '32px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '560px', border: '1px solid var(--glass-border)'
};

export default ChannelStudio;
