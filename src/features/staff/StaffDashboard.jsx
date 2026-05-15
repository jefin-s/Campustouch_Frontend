import { 
  LogOut, ClipboardCheck
} from 'lucide-react';
import DashboardLayout from '../dashboard/DashboardLayout';
import AttendanceMarking from './AttendanceMarking';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';

const StaffDashboard = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const menuItems = [
    { id: 'attendance', label: 'Mark Attendance', icon: <ClipboardCheck size={20} /> }
  ];

  const staffSidebar = (
    <Sidebar 
      menuItems={menuItems} 
      activeTab="attendance" 
      onTabChange={() => {}} // Only one tab for now
    />
  );

  return (
    <DashboardLayout 
      title="Mark Attendance" 
      roleColor="#059669"
      sidebar={staffSidebar}
    >
      <AttendanceMarking />
    </DashboardLayout>
  );
};

export default StaffDashboard;
