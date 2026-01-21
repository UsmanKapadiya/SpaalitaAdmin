import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import BuildIcon from '@mui/icons-material/Build';
import PolicyIcon from '@mui/icons-material/Policy';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './DashboardLayout.css';
import logo from "../../assets/logo.png"
import Button from '../../components/Button/Button';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const navItems = [
        {
            section: '',
            items: [
                { path: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
                { path: '/orders', icon: <ShoppingCartIcon />, label: 'Orders' },
                { path: '/user', icon: <PeopleIcon />, label: 'Users' },
                { path: '/product', icon: <LocalOfferIcon />, label: 'Product' },                
                { path: '/giftCards', icon: <CardGiftcardIcon />, label: 'GiftCard' },
                { path: '/services', icon: <BuildIcon />, label: 'Services' },
                { path: '/bookingPolicy', icon: <PolicyIcon />, label: 'BookingPolicy' },
                { path: '/monthly-special', icon: <EventNoteIcon />, label: 'MonthlySpecial' },
                { path: '/gallery', icon: <PhotoLibraryIcon />, label: 'Gallery' },
                
            ]
        }
    ];

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                    
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((section, index) => (
                        <div key={index} className="nav-section">
                            <div className="nav-section-title">{section.section}</div>
                            {section.items.map((item, itemIndex) => (
                                <Link
                                    key={itemIndex}
                                    to={item.path}
                                    className={`nav-item ${isActive(item.path)}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-text">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user?.username || 'Admin User'}</div>
                            <div className="user-role">{user?.role || 'Administrator'}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Sidebar Overlay for Mobile */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="main-content">
                {/* Top Bar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <Button className="menu-toggle" type="button" onClick={toggleSidebar}>
                            <MenuIcon />
                        </Button>
                        {/* <div className="topbar-search">
                            <SearchIcon />
                            <input type="text" placeholder="Search..." />
                        </div> */}
                    </div>

                    <div className="topbar-right">                    
                        <Button className="btn-icon edit" type="button" onClick={handleLogout}>
                            <LogoutIcon />
                        </Button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
