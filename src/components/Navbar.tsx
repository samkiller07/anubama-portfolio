import React, { useState, useEffect } from 'react';
import { Menu, X, FileDown, Send, ShieldAlert } from 'lucide-react';
import { profileService } from '../services/profileService';

interface NavbarProps {
  onOpenResumeModal: () => void;
  onNavigateAdmin: () => void;
  isSakuraEnabled: boolean;
  onToggleSakura: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenResumeModal,
  onNavigateAdmin,
  isSakuraEnabled,
  onToggleSakura
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    setProfileImage(profileService.getProfileImage());
    const unsubscribe = profileService.onProfileImageChange((newImg) => {
      setProfileImage(newImg);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'skills', 'projects', 'education', 'comments', 'soft-skills', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Guestbook', href: '#comments' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#100b18]/90 backdrop-blur-md border-b border-pink-500/20 shadow-xl shadow-pink-950/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo with Profile Avatar / Sakura Emblem */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-3 group focus:outline-none rounded-xl p-1"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-[1.5px] shadow-lg shadow-pink-500/25 group-hover:scale-105 group-hover:shadow-pink-500/40 transition-all duration-300">
              <div className="w-full h-full rounded-[10px] bg-[#100b18] overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Anubama M" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-lg">桜</span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-pink-300 transition-colors">
                <span>Anubama M</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 font-mono">
                  dev
                </span>
              </div>
              <p className="text-[11px] text-pink-200/60 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></span>
                <span>Immediate Joiner • Software Developer</span>
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#150e20]/80 p-1.5 rounded-full border border-pink-500/20 backdrop-blur-md shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/20 text-pink-200 border border-pink-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-pink-950/40'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Controls & CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Sakura Blossom Toggle */}
            <button
              onClick={onToggleSakura}
              title={isSakuraEnabled ? 'Pause falling petals' : 'Enable falling petals'}
              className={`p-2 rounded-xl text-xs font-mono transition-all border ${
                isSakuraEnabled
                  ? 'bg-pink-950/50 text-pink-300 border-pink-500/30 shadow-sm shadow-pink-500/10'
                  : 'bg-[#150e20] text-slate-400 border-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>🌸</span>
                <span className="text-[11px] font-semibold">{isSakuraEnabled ? 'Petals' : 'Static'}</span>
              </span>
            </button>

            {/* Admin Portal Link */}
            <button
              onClick={onNavigateAdmin}
              title="Open Admin Console"
              className="px-3 py-2 rounded-xl text-xs font-medium text-pink-300/80 hover:text-pink-200 bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/20 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-pink-400" />
              <span>Admin</span>
            </button>

            {/* Resume Button */}
            <button
              onClick={onOpenResumeModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#160e22] hover:bg-[#1f1330] border border-pink-500/30 hover:border-pink-400 hover:text-white transition-all shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5 text-pink-400" />
              <span>Resume</span>
            </button>

            {/* Contact CTA */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:to-rose-500 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Hire Me</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onToggleSakura}
              className="p-2 rounded-lg bg-pink-950/40 border border-pink-500/30 text-xs"
              title="Toggle Sakura Petals"
            >
              🌸
            </button>
            <button
              onClick={onOpenResumeModal}
              aria-label="Download Resume"
              className="p-2 rounded-lg bg-[#160e22] border border-pink-500/30 text-pink-400"
            >
              <FileDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl bg-[#160e22] border border-pink-500/30 text-slate-200 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-pink-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-2xl bg-[#130d1e]/95 border border-pink-500/30 shadow-2xl backdrop-blur-2xl animate-fadeIn">
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-pink-950/40 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-pink-500/20 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigateAdmin();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-pink-950/40 border border-pink-500/30 text-pink-300 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Console</span>
              </button>

              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Get in Touch</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
