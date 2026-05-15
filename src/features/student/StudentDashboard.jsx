import { useState } from 'react';
import { 
  User, CheckSquare
} from 'lucide-react';
import DashboardLayout from '../dashboard/DashboardLayout';
import Sidebar from '../dashboard/Sidebar';
import StudentProfile from './StudentProfile';
import StudentAttendance from './StudentAttendance';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'attendance', label: 'Attendance', icon: <CheckSquare size={20} /> },
  ];

  const studentSidebar = (
    <Sidebar 
      menuItems={menuItems} 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
    />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <StudentProfile />;
      case 'attendance':
        return <StudentAttendance />;
      default:
        return (
          <div className="p-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">{menuItems.find(m => m.id === activeTab)?.label} Module</h2>
            <p className="text-slate-400 mt-4 font-bold tracking-tight italic">Coming soon to your student portal.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      title={menuItems.find(m => m.id === activeTab)?.label} 
      roleColor="#4F46E5"
      sidebar={studentSidebar}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard;
