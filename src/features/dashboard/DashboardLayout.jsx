import { motion } from 'framer-motion';
import { User, Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children, title, roleColor, sidebar }) => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-(--canvas-parchment) font-inter selection:bg-(--primary)/10 selection:text-(--primary)">
      {/* Sidebar Container */}
      <div className="hidden lg:block">
        {sidebar}
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Main Header */}
        <header className="h-20 bg-(--canvas)/90 backdrop-blur-xl border-b border-(--hairline) px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-(--canvas-parchment) rounded-xl transition-colors">
              <Menu size={20} className="text-(--ink-muted-80)" />
            </button>
            <h1 className="text-xl font-noto font-semibold text-(--ink) tracking-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-(--canvas-parchment) border border-(--hairline) px-4 py-2 rounded-xl w-64 group focus-within:border-(--primary)/30 focus-within:bg-white transition-all">
              <Search size={16} className="text-(--ink-muted-48) group-focus-within:text-(--primary) transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none outline-none text-sm font-semibold text-(--ink) placeholder:text-(--ink-muted-48) w-full"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 hover:bg-(--canvas-parchment) text-(--ink-muted-48) hover:text-(--primary) rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-(--primary) rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-px bg-(--hairline) mx-2"></div>

              <div className="flex items-center gap-4 pl-2 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-(--ink) leading-none group-hover:text-(--primary) transition-colors">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-(--ink-muted-48) mt-1">
                    {user?.role || 'Guest'}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-(--primary) flex items-center justify-center text-white shadow-lg shadow-(--primary)/20 group-hover:scale-105 transition-all">
                  <User size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Subtle Organic Background Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-(--primary)/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-(--surface-tile-2)/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

