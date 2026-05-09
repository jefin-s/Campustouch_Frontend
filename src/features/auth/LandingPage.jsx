import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { SignInModal, SignUpModal } from './AuthModals';

const LandingPage = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 70]);

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

  const navLinks = ['Home', 'About', 'Features', 'Modules', 'Dashboard', 'Contact'];

  const stats = [
    { label: 'Institutions', value: '500+', icon: Landmark },
    { label: 'Students', value: '100K+', icon: Users },
    { label: 'Uptime', value: '99.9%', icon: BookOpenCheck },
    { label: 'Secure & Reliable', value: '', icon: ShieldCheck },
  ];

  const modules = [
    {
      title: 'Academic Management',
      description: 'Manage courses, exams, attendance and grading with precision.',
      icon: GraduationCap,
    },
    {
      title: 'Student Information',
      description: 'Centralized student profiles, records, and communication history.',
      icon: Users,
    },
    {
      title: 'Timetable & Scheduling',
      description: 'Smart scheduling for classes, rooms, faculty, and events.',
      icon: CalendarClock,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <section className="relative min-h-screen overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 z-0 scale-[1.07]"
          aria-hidden="true"
        >
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/graduation-hero.png')" }}
          />
        </motion.div>

        <div
          className="absolute inset-0 z-10 bg-gradient-to-b from-white/75 to-white/55 backdrop-blur-[2px]"
          aria-hidden="true"
        />

        <div className="relative z-20 mx-auto flex min-h-screen max-w-[1280px] flex-col px-4 py-5 sm:px-8 md:px-10">
          <header className="sticky top-4 z-40">
            <div className="rounded-2xl border border-white/65 bg-white/58 px-4 py-3 shadow-[0_8px_30px_rgba(15,43,91,0.1)] backdrop-blur-xl sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F2B5B] text-[#D4A44B] shadow-[0_6px_20px_rgba(15,43,91,0.35)]">
                    <GraduationCap size={22} />
                  </div>
                  <div className="leading-tight">
                    <p className="font-display text-lg font-bold uppercase tracking-[0.04em] text-[#0F2B5B]">
                      Kanding College
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#D4A44B]">
                      ERP System
                    </p>
                  </div>
                </div>

                <nav className="hidden items-center gap-8 lg:flex">
                  {navLinks.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-sm font-medium text-[#0F2B5B]/85 transition hover:text-[#0F2B5B]"
                    >
                      {link}
                    </a>
                  ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={openSignIn}
                    className="rounded-xl border border-[#0F2B5B]/30 bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#0F2B5B] shadow-sm transition hover:border-[#0F2B5B]/60 hover:bg-white"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={openSignUp}
                    className="rounded-xl bg-[#0F2B5B] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(15,43,91,0.28)] transition hover:bg-[#0c2550]"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="grid flex-1 items-center gap-10 pb-10 pt-8 lg:grid-cols-2 lg:pt-12">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-[640px]"
            >
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#D4A44B] sm:text-sm">
                SMARTER CAMPUS. STRONGER FUTURE.
              </p>

              <h1 className="font-display text-5xl font-bold leading-[0.98] text-[#0F2B5B] sm:text-6xl lg:text-[72px]">
                All-in-One College ERP Solution
              </h1>

              <p className="mt-6 max-w-[560px] text-base leading-8 text-[#1E293B]/80 sm:text-lg">
                Streamline academic, administrative, and communication processes in one integrated
                platform.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={openSignUp}
                  className="inline-flex h-14 items-center gap-2 rounded-xl bg-[#0F2B5B] px-8 text-base font-semibold text-white shadow-[0_14px_30px_rgba(15,43,91,0.3)] transition hover:-translate-y-0.5 hover:bg-[#0c2550]"
                >
                  Get Started
                  <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  onClick={openSignIn}
                  className="inline-flex h-14 items-center rounded-xl border border-[#0F2B5B]/25 bg-white/70 px-8 text-base font-semibold text-[#0F2B5B] shadow-sm backdrop-blur transition hover:border-[#0F2B5B]/50 hover:bg-white"
                >
                  Take a Tour
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-10 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-[0_18px_35px_rgba(15,43,91,0.1)] backdrop-blur-xl sm:mt-14 sm:p-6"
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/60 bg-white/60 p-3.5 shadow-sm"
                      >
                        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#D4A44B]/15 text-[#0F2B5B]">
                          <Icon size={18} />
                        </div>
                        {stat.value ? (
                          <p className="text-lg font-bold text-[#0F2B5B]">{stat.value}</p>
                        ) : null}
                        <p className="text-xs font-semibold text-[#1E293B]/75">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>

            <div className="relative h-full min-h-[220px] lg:min-h-[560px]">
              <div className="grid gap-4 sm:grid-cols-3 lg:absolute lg:bottom-10 lg:right-4 lg:flex lg:gap-4">
                {modules.map((module, index) => {
                  const Icon = module.icon;

                  return (
                    <motion.article
                      key={module.title}
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.25 + index * 0.12 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="w-full rounded-3xl border border-white/75 bg-white/68 p-5 shadow-[0_18px_30px_rgba(15,43,91,0.13)] backdrop-blur-xl lg:w-52"
                      style={{
                        animation: `floatingCard ${5 + index * 0.6}s ease-in-out ${index * 0.25}s infinite`,
                      }}
                    >
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F2B5B]/10 text-[#0F2B5B]">
                        <Icon size={18} />
                      </div>
                      <h3 className="text-base font-semibold text-[#0F2B5B]">{module.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-[#1E293B]/78">{module.description}</p>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SignInModal isOpen={isSignInOpen} onClose={closeModals} onSwitchToSignUp={openSignUp} />
      <SignUpModal isOpen={isSignUpOpen} onClose={closeModals} onSwitchToSignIn={openSignIn} />
    </div>
  );
};

export default LandingPage;
