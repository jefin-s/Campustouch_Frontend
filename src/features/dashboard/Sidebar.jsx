import { motion } from 'framer-motion';
import { LogOut, GraduationCap, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ menuItems, activeTab, onTabChange }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  return (
    <aside className="w-72 h-screen bg-white border-r border-[#e0e0e0] flex flex-col sticky top-0">
      {/* Sidebar Header */}
      <div className="px-6 pt-8 pb-6 border-b border-[#e0e0e0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#0066cc] flex items-center justify-center text-white shadow-[rgba(0,102,204,0.3)_0_4px_12px]">
            <GraduationCap size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] font-semibold font-['SF Pro Display'] tracking-[-0.28px] text-[#1d1d1f] leading-tight">
              Campus<span className="text-[#0066cc]">Touch</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#1d1d1f]/40 mt-1">
              Management ERP
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full group flex items-center gap-3 px-4 py-2.5 rounded-[10px] cursor-pointer transition-all duration-200
                ${isActive
                  ? 'bg-[#0066cc] text-white shadow-[rgba(0,102,204,0.2)_0_2px_8px]'
                  : 'text-[#1d1d1f]/60 hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                }
              `}
            >
              <div className={`
                transition-colors duration-200 flex-shrink-0
                ${isActive
                  ? 'text-white'
                  : 'text-[#1d1d1f]/40 group-hover:text-[#0066cc]'
                }
              `}>
                {item.icon}
              </div>
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] flex-1 text-left">
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="w-1.5 h-1.5 rounded-full bg-white/60"
                />
              )}
              {!isActive && (
                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#1d1d1f]/30" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-3 py-6 border-t border-[#e0e0e0]">
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <div className="p-1.5 rounded-lg bg-red-50 text-red-500/60 group-hover:bg-red-500 group-hover:text-white transition-all duration-200 flex-shrink-0">
            <LogOut size={16} />
          </div>
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em]">Logout</span>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;