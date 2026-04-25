import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const DashboardLayout = ({ children, title, roleColor, sidebar }) => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      {sidebar}

      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <Menu className="menu-icon" />
            <h1>{title}</h1>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Search..." />
            </div>
            <div className="icon-btn">
              <Bell size={20} />
              <span className="badge"></span>
            </div>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user?.email?.split('@')[0]}</span>
                <span className="user-role" style={{ color: roleColor }}>{user?.role}</span>
              </div>
              <div className="avatar">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <motion.div 
          className="content-area"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
