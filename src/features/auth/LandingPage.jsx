import React, { useState } from 'react';
import { GraduationCap, Book, Users, Calendar, FileText, BarChart, BookOpen, ChevronRight } from 'lucide-react';
import { SignInModal, SignUpModal } from './AuthModals';
import './LandingPage.css';

const LandingPage = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const openSignIn = () => {
    setIsSignInOpen(true);
    setIsSignUpOpen(false);
  };

  const openSignUp = () => {
    setIsSignUpOpen(true);
    setIsSignInOpen(false);
  };

  const closeModals = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
  };

  const features = [
    {
      icon: <Book size={24} />,
      title: 'Course Management',
      description: 'Streamline curriculum planning and course scheduling'
    },
    {
      icon: <Users size={24} />,
      title: 'Student Portal',
      description: 'Centralized access to grades, attendance, and resources'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Smart Scheduling',
      description: 'Automated timetables and exam scheduling'
    },
    {
      icon: <FileText size={24} />,
      title: 'Digital Records',
      description: 'Paperless documentation and secure data storage'
    },
    {
      icon: <BarChart size={24} />,
      title: 'Analytics',
      description: 'Real-time insights and performance tracking'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Faculty Hub',
      description: 'Tools for teachers to manage classes and assessments'
    }
  ];

  const stats = [
    { value: '500+', label: 'Colleges Trust Us' },
    { value: '2M+', label: 'Active Students' },
    { value: '99.9%', label: 'Uptime Guarantee' }
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="logo">
          <div className="logo-icon">
            <GraduationCap size={24} />
          </div>
          <div className="logo-text">
            <h1>EduManage</h1>
            <p>College Management System</p>
          </div>
        </div>
        <div className="nav-actions">
          <button className="nav-link" onClick={openSignIn}>Sign In</button>
          <button className="nav-btn" onClick={openSignUp}>Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your College
            <span>Management Experience</span>
          </h1>
          <p className="hero-subtitle">
            All-in-one platform for seamless administration, student management, and academic excellence
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={openSignUp}>Get Started Free</button>
            <button className="btn-secondary">Watch Demo</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer (Optional, but good for design) */}
      <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        &copy; 2026 EduManage. All rights reserved.
      </footer>

      {/* Auth Modals */}
      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={closeModals} 
        onSwitchToSignUp={openSignUp}
      />
      <SignUpModal 
        isOpen={isSignUpOpen} 
        onClose={closeModals} 
        onSwitchToSignIn={openSignIn}
      />
    </div>
  );
};

export default LandingPage;
