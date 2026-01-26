import React, { useState, useContext } from 'react';
import { Menu, Search, Video, Bell, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchQuery}`);
    };

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button><Menu size={24} /></button>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ backgroundColor: 'red', padding: '4px', borderRadius: '4px' }}>
                        <Video size={18} color="white" />
                    </div>
                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>YouTube</span>
                </Link>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, maxWidth: '600px', margin: '0 40px' }}>
                <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                        flex: 1, 
                        backgroundColor: '#121212', 
                        border: '1px solid #303030', 
                        padding: '8px 16px', 
                        borderRadius: '20px 0 0 20px',
                        color: 'white',
                        fontSize: '16px'
                    }}
                />
                <button style={{ 
                    backgroundColor: '#222222', 
                    border: '1px solid #303030', 
                    padding: '0 20px', 
                    borderRadius: '0 20px 20px 0',
                    borderLeft: 'none'
                }}>
                    <Search size={20} />
                </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button><Video size={24} /></button>
                <button><Bell size={24} /></button>
                {user ? (
                    <Link to="/studio" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3f51b5', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    </Link>
                ) : (
                    <Link to="/auth" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        border: '1px solid #3ea6ff', 
                        color: '#3ea6ff', 
                        padding: '6px 12px', 
                        borderRadius: '20px',
                        fontWeight: '500'
                    }}>
                        <UserIcon size={20} />
                        Sign In
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
