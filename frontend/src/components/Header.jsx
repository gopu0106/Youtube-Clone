import React, { useState, useContext } from 'react';
import { Menu, Search, Video, Bell, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = ({ toggleSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchQuery}`);
    };

    return (
        <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn-icon" onClick={toggleSidebar}>
                    <Menu size={22} />
                </button>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}>
                    <div style={{ backgroundColor: 'var(--accent-primary)', padding: '5px', borderRadius: '6px', display: 'flex' }}>
                        <Video size={16} color="white" />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.5px' }}>YouTube</span>
                </Link>
            </div>

            <form onSubmit={handleSearch} className="search-container">
                <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-btn">
                    <Search size={18} />
                </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="btn-icon">
                    <Video size={20} />
                </button>
                <button className="btn-icon">
                    <Bell size={20} />
                </button>
                {user ? (
                    <Link to="/studio">
                        <div className="btn-icon" style={{ 
                            backgroundColor: 'var(--bg-tertiary)', 
                            fontSize: '14px',
                            fontWeight: '600',
                            border: '1px solid var(--glass-border)'
                        }}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    </Link>
                ) : (
                    <Link to="/auth" className="btn btn-ghost" style={{ 
                        border: '1px solid var(--glass-border)',
                        color: '#3ea6ff', 
                    }}>
                        <UserIcon size={18} />
                        <span style={{ marginLeft: '4px' }}>Sign In</span>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
