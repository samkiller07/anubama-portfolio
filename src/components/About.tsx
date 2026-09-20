import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  BrainCircuit, 
  Rocket, 
  Clock,
  MapPin,
  GraduationCap,
  User
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { profileService } from '../services/profileService';

export const About: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    setProfileImage(profileService.getProfileImage());
    profileService.fetchProfileImage().then((img) => {
      if (img !== undefined) setProfileImage(img);
    });
    const unsubscribe = profileService.onProfileImageChange((newImg) => {
      setProfileImage(newImg);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="about" className="py-24 relative bg-[#0c0814] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none -z-0" />

      {/* Decorative Sakura Section Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-pink-500/50" />
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-mono font-medium shadow-sm">
              <span>🌸</span>
              <span>PROFILE &amp; BACKGROUND</span>
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-pink-500/50" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 bg-clip-text text-transparent">Anubama M</span>
          </h2>
          <p className="mt-3 text-slate-300 max-w-xl text-sm sm:text-base">
            Dedicated software developer focused on architecting dependable applications and delivering clean full-stack solutions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Career Statement Box */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-8 rounded-3xl bg-[#140e1f]/90 border border-pink-500/25 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-pink-950/40">
              <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-2 text-pink-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
                <Terminal className="w-4 h-4" />
                <span>Professional Summary</span>
              </div>

              <blockquote className="text-base sm:text-lg text-pink-100/95 font-medium leading-relaxed mb-6 border-l-2 border-pink-400/60 pl-4 italic">
                &ldquo;{personalInfo.about.summary}&rdquo;
              </blockquote>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                As a passionate software developer, I bridge frontend interactivity and backend robustness. I enjoy breaking down complex problems into modular code, adhering to clean architecture principles, and building software that delivers a pleasant and reliable user experience.
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personalInfo.about.highlights.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#120d1c]/80 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 shadow-md shadow-pink-950/20"
                >
                  <div className="flex items-center gap-2 text-pink-300 font-bold text-sm mb-2">
                    <span className="text-pink-400">🌸</span>
                    <span>{pillar.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Facts & Snapshot Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Quick Profile Summary Card */}
            <div className="p-6 rounded-3xl bg-[#140e1f]/90 border border-pink-500/25 shadow-2xl shadow-pink-950/40 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-pink-400 font-semibold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Candidate Snapshot</span>
                </h3>

                {/* Mini Profile Photo Avatar */}
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 overflow-hidden flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt="Anubama M" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-pink-400" />
                  )}
                </div>
              </div>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0d0915] border border-pink-500/15">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Availability</span>
                    <span className="font-semibold text-white">Immediate Joiner (Fresher)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0d0915] border border-pink-500/15">
                  <MapPin className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Current Location</span>
                    <span className="font-semibold text-white">Chennai, Tamil Nadu, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0d0915] border border-pink-500/15">
                  <GraduationCap className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Degree</span>
                    <span className="font-semibold text-white">B.Tech (2021–2025)</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Kalasalingam Academy of Research and Education</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#0d0915] border border-pink-500/15">
                  <Rocket className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block">Core Specialization</span>
                    <span className="font-semibold text-white">React.js • Java • Spring Boot • MySQL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Mindset Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1d122b]/80 to-[#120d1c] border border-pink-500/30">
              <div className="flex items-center gap-2 text-pink-300 font-bold text-sm mb-2">
                <BrainCircuit className="w-4 h-4 text-pink-400" />
                <span>Continuous Learning &amp; Agility</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Dedicated to writing clean, maintainable, and well-documented software solutions. Quick to assimilate modern tech stacks, libraries, and engineering best practices.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
