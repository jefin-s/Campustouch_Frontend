import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, GraduationCap, BarChart3, Leaf, Shield,
  ChevronRight, Sparkles, CheckCircle, Apple, Menu, X,
  Clock, Trophy, Users, BookOpen, Calendar, Award
} from 'lucide-react';
import { SignInModal, SignUpModal } from './AuthModals';

const LandingPage = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openSignIn = () => {
    setIsSignInOpen(true);
    setIsSignUpOpen(false);
    setMobileMenuOpen(false);
  };
  const openSignUp = () => {
    setIsSignUpOpen(true);
    setIsSignInOpen(false);
    setMobileMenuOpen(false);
  };
  const closeModals = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
  };

  const features = [
    { icon: BarChart3, title: 'Attendance Tracking', description: 'Scholarly and precise monitoring of student engagement and participation.' },
    { icon: Users, title: 'Student Management', description: 'Comprehensive student lifecycle tools from enrollment to graduation.' },
    { icon: Shield, title: 'Staff Management', description: 'Empowering faculty and administration with streamlined workflows.' },

  ];

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] overflow-x-hidden">
      {/* Apple-style Global Navigation */}

      {/* Frosted Glass Sub-nav */}
      <div className="fixed top-11 left-0 right-0 bg-[#f5f5f7]/80 backdrop-blur-xl z-40 h-13 border-b border-white/20">
        <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0066cc] rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="text-[21px] font-semibold tracking-[0.231px] font-['SF Pro Display']">CampusTouch ERP</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={openSignIn} className="text-[#0066cc] text-[14px] font-['SF Pro Text']">Student Login</button>
            <button onClick={openSignUp} className="bg-[#0066cc] text-white px-5 py-1.5 rounded-full text-[14px] hover:scale-95 transition-transform">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="features" className="pt-32 pb-20 bg-[#f5f5f7]">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-6 shadow-sm">
                <Sparkles size={14} className="text-[#0066cc]" />
                <span className="text-[14px] text-[#1d1d1f] font-['SF Pro Text']">Institutional Excellence</span>
              </div>
              <h1 className="text-[56px] md:text-[64px] font-semibold leading-[1.07] tracking-[-0.28px] font-['SF Pro Display'] text-[#1d1d1f] mb-6">
                Cultivating Knowledge<br />
                <span className="text-[#0066cc]">for the Future</span>
              </h1>
              <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-[#1d1d1f]/70 max-w-[540px] mb-10">
                CampusTouch provides a premier environment for academic rigor, groundbreaking research,
                and the holistic development of tomorrow's leaders.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={openSignUp} className="bg-[#0066cc] text-white px-7 py-3 rounded-full text-[17px] hover:scale-95 transition-transform inline-flex items-center gap-2">
                  Access Portal <ArrowRight size={18} />
                </button>
                <button onClick={openSignIn} className="border border-[#0066cc] text-[#0066cc] px-7 py-3 rounded-full text-[17px] hover:bg-[#0066cc]/5 transition-colors">
                  Explore Programs
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-[18px] overflow-hidden shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px]">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
                  alt="Campus life"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section - Light Tile */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[40px] font-semibold leading-[1.1] font-['SF Pro Display'] text-[#1d1d1f] mb-6">
              About CampusTouch
            </h2>
            <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-[#1d1d1f]/70 max-w-[900px] mx-auto">
              CampusTouch envisions a future where digital academic management seamlessly integrates with scholarly tradition.
              Our platform empowers institutions to streamline operations while maintaining the highest standards of academic
              excellence and intellectual rigor.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Parchment Tile */}
      <section className="py-20 bg-[#f5f5f7]">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[40px] font-semibold leading-[1.1] font-['SF Pro Display'] text-[#1d1d1f] mb-4">
              Core Capabilities
            </h2>
            <p className="text-[17px] leading-[1.47] tracking-[-0.374px] text-[#1d1d1f]/70">
              Tools designed for comprehensive academic stewardship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-[18px] p-8 border border-[#e0e0e0] hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#0066cc]/10 rounded-full flex items-center justify-center mb-5">
                  <feature.icon size={26} className="text-[#0066cc]" />
                </div>
                <h3 className="text-[22px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[15px] leading-[1.43] text-[#1d1d1f]/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - White Tile */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Institutions' },
              { value: '1M+', label: 'Active Users' },
              { value: '50k+', label: 'Daily Transactions' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-[44px] font-bold text-[#0066cc] font-['SF Pro Display']">{stat.value}</p>
                <p className="text-[14px] text-[#1d1d1f]/60 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Tile */}
      <section className="py-24 bg-[#272729]">
        <div className="max-w-[1440px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-[40px] md:text-[48px] font-semibold leading-[1.1] font-['SF Pro Display'] text-white mb-4">
              Begin Your Story <br />
              <span className="text-[#cccccc]">at CampusTouch.</span>
            </h2>
            <p className="text-[17px] leading-[1.47] text-white/60 max-w-[540px] mx-auto mb-12">
              Join thousands of institutions already transforming their academic management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={openSignUp} className="bg-[#0066cc] text-white px-8 py-3 rounded-full text-[17px] hover:scale-95 transition-transform">
                Register Account
              </button>
              <button onClick={openSignIn} className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-full text-[17px] hover:bg-white/10 transition-all">
                Login
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] pt-20 pb-12 border-t border-[#e0e0e0]">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0066cc] rounded-xl flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <span className="text-[24px] font-semibold font-['SF Pro Display']">CampusTouch</span>
              </div>
              <p className="text-[14px] text-[#1d1d1f]/60 leading-relaxed max-w-sm">
                Photography-first interface and rigorous operations, designed for modern institutions.
              </p>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6 text-[#1d1d1f]/40">Experience</h3>
              <ul className="space-y-3">
                {["Curriculum", "Admissions", "Campus Life", "Research"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-[14px] text-[#1d1d1f]/60 hover:text-[#0066cc] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-6 text-[#1d1d1f]/40">Institutional</h3>
              <ul className="space-y-3">
                {["About", "Privacy", "Terms", "Support"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-[14px] text-[#1d1d1f]/60 hover:text-[#0066cc] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#e0e0e0] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-[#1d1d1f]/40">© 2026 CampusTouch Institutional Hub.</p>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn', 'Journal'].map(item => (
                <a key={item} href="#" className="text-[12px] text-[#1d1d1f]/40 hover:text-[#0066cc] transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 md:hidden"
          >
            <div className="pt-20 px-8">
              <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 text-white">
                <X size={24} />
              </button>
              <div className="flex flex-col items-center gap-6">
                {['Features', 'About', 'Get Started'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-white text-[21px] font-['SF Pro Display']" onClick={() => setMobileMenuOpen(false)}>
                    {item}
                  </a>
                ))}
                <button onClick={openSignIn} className="w-full bg-[#1d1d1f] text-white py-3 rounded-full">Sign In</button>
                <button onClick={openSignUp} className="w-full bg-[#0066cc] text-white py-3 rounded-full">Register</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modals */}
      {isSignInOpen && (
        <SignInModal isOpen={isSignInOpen} onClose={closeModals} onSwitchToSignUp={openSignUp} />
      )}
      {isSignUpOpen && (
        <SignUpModal isOpen={isSignUpOpen} onClose={closeModals} onSwitchToSignIn={openSignIn} />
      )}
    </div>
  );
};

export default LandingPage;