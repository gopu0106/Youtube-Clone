import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, ChevronRight, Library } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, isOpen }) => (
    <NavLink 
        to={to} 
        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
    >
        <Icon size={22} strokeWidth={label && label !== "" ? 2 : 1.5} />
        <AnimatePresence mode="wait">
            {isOpen && label && (
                <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
                >
                    {label}
                </motion.span>
            )}
        </AnimatePresence>
    </NavLink>
);

const Sidebar = ({ isOpen }) => {
    return (
        <motion.aside 
            className="sidebar"
            animate={{ width: isOpen ? 240 : 72 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <SidebarItem icon={Home} label="Home" to="/" isOpen={isOpen} />
            <SidebarItem icon={Compass} label="Shorts" to="/shorts" isOpen={isOpen} />
            <SidebarItem icon={PlaySquare} label="Subscriptions" to="/subscriptions" isOpen={isOpen} />
            
            <div className="sidebar-divider" />
            
            <SidebarItem icon={Library} label="Library" to="/library" isOpen={isOpen} />
            <SidebarItem icon={Clock} label="History" to="/history" isOpen={isOpen} />
            <SidebarItem icon={PlaySquare} label="Your videos" to="/studio" isOpen={isOpen} />
            <SidebarItem icon={ThumbsUp} label="Liked videos" to="/liked" isOpen={isOpen} />
            
            {isOpen && (
                <>
                    <div className="sidebar-divider" />
                    <div className="sidebar-section-title">
                        <span>Subscriptions</span>
                    </div>
                </>
            )}
        </motion.aside>
    );
};

export default Sidebar;
