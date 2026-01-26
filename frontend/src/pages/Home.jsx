import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import { useLocation } from 'react-router-dom';

const categories = ['All', 'Music', 'Gaming', 'Code', 'News', 'Movies', 'Sports'];

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/videos?title=${searchQuery}&category=${activeCategory}`);
                setVideos(res.data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };
        fetchVideos();
    }, [searchQuery, activeCategory]);

    return (
        <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{ 
                            backgroundColor: activeCategory === cat ? 'white' : '#272727',
                            color: activeCategory === cat ? 'black' : 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            whiteSpace: 'nowrap',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <div className="video-grid">
                {videos.length > 0 ? (
                    videos.map(video => <VideoCard key={video._id} video={video} />)
                ) : (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px', color: '#aaaaaa' }}>
                        No videos found. Try uploading some!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;
