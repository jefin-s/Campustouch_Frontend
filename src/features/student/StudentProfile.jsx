import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Book, 
  Award, Clock, Building, Heart, Shield, Loader2
} from 'lucide-react';
import { getStudentProfile } from '../../services/studentService';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getStudentProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="profile-loading">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading your premium experience...</p>
      </div>
    );
  }

  if (!profile) {
    return <div className="empty-state">Unable to load profile data.</div>;
  }

  const profileImage = profile.profileImageUrl || profile.profileImage;
  const bannerUrl = 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop';

  return (
    <div className="premium-profile-container">
      {/* Header / Hero Section */}
      <div className="profile-hero">
        <div className="profile-banner" style={{ backgroundImage: `url(${bannerUrl})` }}></div>
        <div className="hero-content">
          <div className="profile-avatar-large">
            {profileImage ? (
              <img src={profileImage.startsWith('http') ? profileImage : `https://localhost:7284/${profileImage}`} alt="Profile" />
            ) : (
              <div className="avatar-placeholder-large">
                {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
              </div>
            )}
            <div className="status-indicator active"></div>
          </div>
          <div className="hero-text">
            <h1>{profile.firstName} {profile.lastName}</h1>
            <p className="admission-no">{profile.admissionNumber}</p>
            <div className="hero-badges">
              <span className="badge-pill premium">Student</span>
              <span className="badge-pill secondary">{profile.courseName || 'Computer Science'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-main-grid">
        {/* Left Column - Personal Info */}
        <div className="profile-column">
          <div className="glass-card">
            <div className="card-header">
              <User size={20} />
              <h3>Personal Details</h3>
            </div>
            <div className="details-list">
              <div className="detail-item">
                <Mail size={18} />
                <div className="detail-info">
                  <span>Email</span>
                  <p>{profile.email}</p>
                </div>
              </div>
              <div className="detail-item">
                <Phone size={18} />
                <div className="detail-info">
                  <span>Phone</span>
                  <p>{profile.phoneNumber}</p>
                </div>
              </div>
              <div className="detail-item">
                <Calendar size={18} />
                <div className="detail-info">
                  <span>Date of Birth</span>
                  <p>{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="detail-item">
                <Heart size={18} />
                <div className="detail-info">
                  <span>Blood Group</span>
                  <p>{profile.bloodGroup || 'O+'}</p>
                </div>
              </div>
              <div className="detail-item">
                <MapPin size={18} />
                <div className="detail-info">
                  <span>Address</span>
                  <p>{profile.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card mt-24">
            <div className="card-header">
              <Shield size={20} />
              <h3>Guardian Information</h3>
            </div>
            <div className="details-list">
              <div className="detail-item">
                <User size={18} />
                <div className="detail-info">
                  <span>Guardian Name</span>
                  <p>{profile.guardianName}</p>
                </div>
              </div>
              <div className="detail-item">
                <Phone size={18} />
                <div className="detail-info">
                  <span>Guardian Phone</span>
                  <p>{profile.guardianPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Academic Info */}
        <div className="profile-column">
          <div className="glass-card">
            <div className="card-header">
              <Book size={20} />
              <h3>Academic Status</h3>
            </div>
            <div className="academic-grid">
              <div className="academic-box">
                <Building size={24} />
                <div className="box-info">
                  <span>Department</span>
                  <p>{profile.departmentName || 'Information Technology'}</p>
                </div>
              </div>
              <div className="academic-box">
                <Award size={24} />
                <div className="box-info">
                  <span>Current Semester</span>
                  <p>Semester {profile.currentSemester || '4'}</p>
                </div>
              </div>
              <div className="academic-box">
                <Clock size={24} />
                <div className="box-info">
                  <span>Admission Date</span>
                  <p>{new Date(profile.admissionDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="academic-box">
                <Shield size={24} />
                <div className="box-info">
                  <span>Status</span>
                  <p className={profile.isActive ? 'text-success' : 'text-danger'}>
                    {profile.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card mt-24">
            <div className="card-header">
              <Award size={20} />
              <h3>Performance Overview</h3>
            </div>
            <div className="performance-placeholder">
              <div className="chart-mock">
                {/* Visual representation of GPA/Performance */}
                <div className="gpa-circle">
                  <span className="gpa-value">3.8</span>
                  <span className="gpa-label">CGPA</span>
                </div>
              </div>
              <div className="performance-stats">
                <div className="stat">
                  <span>Attendance</span>
                  <p>92%</p>
                </div>
                <div className="stat">
                  <span>Completed Credits</span>
                  <p>64 / 120</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
