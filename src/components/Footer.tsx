import React from 'react';
import { ArrowUp, Github, Linkedin, Mail, Instagram } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

interface FooterProps {
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin: _onNavigateAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Guestbook', href: '#comments' },
    { name: 'Interpersonal', href: '#soft-skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative bg-[#07040c] border-t border-pink-500/20 pt-16 pb-12 overflow-hidden">
      {/* Glow backdrop */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-pink-500/15">
          
          {/* Brand Col */}
          <div className="md:col-span-6 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-pink-500/25">
                🌸
              </div>
              <span className="font-bold text-xl text-white">
                Anubama M
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-4 leading-relaxed">
              Software Developer specializing in JavaScript, React.js, Java, and Spring Boot. Immediate Joiner based in Chennai.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-pink-300/80">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
              <span>Available for immediate engineering opportunities</span>
            </div>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-pink-300 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Profiles */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-2.5">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 text-pink-400" />
                <span>github.com/anubamam2003</span>
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-pink-300 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-pink-400" />
                <span>linkedin.com/in/anubama2003</span>
              </a>
              <a
                href={personalInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-pink-300 transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>@anubama_murugesan_</span>
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-pink-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-pink-400" />
                <span>{personalInfo.email}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1 font-mono">
            <span>&copy; {new Date().getFullYear()} Anubama M. Sakura Design System • Crafted with React &amp; Spring Boot.</span>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-950/40 border border-pink-500/20 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-all font-mono"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
