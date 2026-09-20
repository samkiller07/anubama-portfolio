import React, { useState, useEffect } from 'react';
import { personalInfo } from '../data/portfolioData';
import { profileService } from '../services/profileService';
import {
  FileDown,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Instagram,
  Code2
} from 'lucide-react';

interface HeroProps {
  onOpenResumeModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResumeModal }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    setProfileImage(profileService.getProfileImage());
    const unsubscribe = profileService.onProfileImageChange((newImg) => {
      setProfileImage(newImg);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden bg-[#0a0711] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#23122b] via-[#100b18] to-[#07050a]"
    >
      {/* Sakura Atmospheric Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative Japanese Character Silhouette */}
      <div className="absolute top-20 right-8 lg:right-24 text-[14rem] sm:text-[20rem] font-serif font-black text-pink-500/[0.03] select-none pointer-events-none tracking-widest leading-none z-0">
        桜
      </div>

      <div className="max-w-7xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Bio & Value Proposition */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-pink-950/60 border border-pink-500/30 backdrop-blur-md shadow-sm shadow-pink-950/40 mb-6">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span className="text-xs font-semibold text-pink-200 tracking-wide">
              🌸 Available for Immediate Joining • Software Developer
            </span>
          </div>

          {/* Main Headings */}
          <div className="space-y-2 mb-6">
            <h2 className="text-pink-300 font-mono text-sm sm:text-base font-semibold tracking-wider uppercase flex items-center gap-2">
              <span>Hello, I am</span>
              <span className="w-8 h-[1px] bg-pink-400/60"></span>
            </h2>
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Anubama M
            </h1>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-pink-300 via-rose-300 to-pink-100 bg-clip-text text-transparent">
              Software Developer
            </div>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8 font-normal">
            Specializing in <strong className="text-pink-200 font-semibold">React.js</strong> frontend architectures, <strong className="text-pink-200 font-semibold">Java &amp; Spring Boot</strong> enterprise microservices, and <strong className="text-pink-200 font-semibold">MySQL</strong> databases. Delivering responsive user experiences and structured backend APIs with clean code principles.
          </p>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg mb-8">
            <div className="p-3.5 rounded-2xl bg-[#130d1e]/80 border border-pink-500/20 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-extrabold text-pink-300 font-mono">B.Tech</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">2021–2025 Graduated</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#130d1e]/80 border border-pink-500/20 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-extrabold text-pink-300 font-mono">5+ Projects</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">Full Stack &amp; React</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#130d1e]/80 border border-pink-500/20 backdrop-blur-sm">
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">0 Days</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">Notice Period</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-8">
            <a
              href="#projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:via-rose-400 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 transition-all duration-300 active:scale-95"
            >
              <span>Explore Case Studies</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenResumeModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#150e20] hover:bg-[#1d132c] text-pink-200 hover:text-white border border-pink-500/30 hover:border-pink-400 font-semibold text-sm transition-all duration-300 shadow-lg shadow-pink-950/40"
            >
              <FileDown className="w-4 h-4 text-pink-400" />
              <span>Download Resume</span>
            </button>
          </div>

          {/* Quick Contact & Social Links */}
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span className="text-pink-400/80">Connect:</span>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-pink-950/40 border border-pink-500/20 text-pink-300 hover:text-white hover:bg-pink-900/40 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-pink-950/40 border border-pink-500/20 text-pink-300 hover:text-white hover:bg-pink-900/40 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-2 rounded-xl bg-pink-950/40 border border-pink-500/20 text-pink-300 hover:text-white hover:bg-pink-900/40 transition-colors"
              title="Send Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={personalInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-xl bg-pink-950/40 border border-pink-500/20 text-pink-300 hover:text-white hover:bg-pink-900/40 transition-colors"
              title="Instagram: @anubama_murugesan_"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column: Prominent Sakura Profile Portrait & Developer Code Card */}
        <div className="lg:col-span-5 flex flex-col items-center gap-6 relative">
          
          {/* Prominent Sakura Profile Portrait Showcase */}
          <div className="relative group w-full max-w-[340px] sm:max-w-[380px]">
            {/* Ambient blossom glow */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-300 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-75 transition duration-700 pointer-events-none" />

            {/* Profile Frame Card */}
            <div className="relative rounded-[2rem] bg-[#120c1d]/95 border-2 border-pink-500/30 shadow-2xl p-4 sm:p-5 backdrop-blur-xl overflow-hidden flex flex-col items-center">
              
              {/* Top Accent Bar */}
              <div className="w-full flex items-center justify-between mb-3 text-[11px] font-mono text-pink-300/80">
                <span className="flex items-center gap-1">🌸 SOFTWARE DEVELOPER</span>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold">2025 Graduate</span>
              </div>

              {/* Portrait Area */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-pink-500/40 shadow-inner bg-[#0b0714] flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Anubama M"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1f102b] via-[#150a20] to-[#0d0715] flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center mb-2 shadow-lg shadow-pink-500/20">
                      <span className="text-2xl select-none">🌸</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">Anubama M</span>
                    <span className="text-[10px] text-pink-300/80">B.Tech Software Developer</span>
                  </div>
                )}

                {/* Instant Verification Tag */}
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-[#0e0a17]/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Immediate Joiner</span>
                </div>
              </div>

              {/* Bottom Quick Specs */}
              <div className="w-full grid grid-cols-2 gap-2 mt-4 text-center">
                <div className="p-2 rounded-xl bg-[#0d0916] border border-pink-500/15">
                  <div className="text-[10px] text-slate-400 font-mono">Frontend</div>
                  <div className="text-xs font-bold text-pink-200">React.js • Tailwind</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0d0916] border border-pink-500/15">
                  <div className="text-[10px] text-slate-400 font-mono">Backend</div>
                  <div className="text-xs font-bold text-pink-200">Java • Spring Boot</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Developer Architecture Snippet */}
          <div className="w-full max-w-[340px] sm:max-w-[380px] rounded-2xl bg-[#0e0a16]/90 border border-pink-500/25 p-3.5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] font-mono text-pink-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-pink-400" />
                <span>anubama.config.ts</span>
              </span>
              <span className="text-slate-400 text-[10px]">Java 17 &amp; React 18</span>
            </div>
            <div className="font-mono text-[11px] text-slate-300 leading-snug">
              <p><span className="text-pink-400">const</span> candidate = {'{'}</p>
              <p className="pl-3"><span className="text-pink-300">name</span>: <span className="text-emerald-300">"Anubama M"</span>,</p>
              <p className="pl-3"><span className="text-pink-300">role</span>: <span className="text-emerald-300">"Software Developer"</span>,</p>
              <p className="pl-3"><span className="text-pink-300">location</span>: <span className="text-emerald-300">"Chennai, India"</span></p>
              <p>{'}'};</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
