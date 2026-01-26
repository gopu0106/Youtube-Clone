import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to }) => (
    <NavLink 
        to={to} 
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            padding: '10px 12px',
            borderRadius: '10px',
            backgroundColor: isActive ? '#3f3f3f' : 'transparent',
            color: 'white'
        })}
    >
        <Icon size={22} />
        <span style={{ fontSize: '14px' }}>{label}</span>
    </NavLink>
);

const Sidebar = ({ isOpen }) => {
    return (
        <aside className="sidebar" style={{ width: isOpen ? '240px' : '72px' }}>
            <SidebarItem icon={Home} label={isOpen ? "Home" : ""} to="/" />
            <SidebarItem icon={Compass} label={isOpen ? "Shorts" : ""} to="/shorts" />
            <SidebarItem icon={PlaySquare} label={isOpen ? "Subscriptions" : ""} to="/subscriptions" />
            <hr style={{ border: 'none', borderTop: '1px solid #3f3f3f', margin: '12px 0' }} />
            {isOpen && (
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '500' }}>You</span>
                    <ChevronRight size={16} />
                </div>
            )}
            <SidebarItem icon={Clock} label={isOpen ? "History" : ""} to="/history" />
            <SidebarItem icon={PlaySquare} label={isOpen ? "Your videos" : ""} to="/studio" />
            <SidebarItem icon={ThumbsUp} label={isOpen ? "Liked videos" : ""} to="/liked" />
        </aside>
    );
};

export default Sidebar;
