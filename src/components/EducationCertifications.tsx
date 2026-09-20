import React from 'react';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { educationData, certificationsData } from '../data/portfolioData';
import { CardCarousel } from './CardCarousel';

export const EducationCertifications: React.FC = () => {
  const renderCertCard = (cert: typeof certificationsData[0], idx: number) => (
    <div
      key={idx}
      className="h-full p-6 rounded-3xl bg-[#140e20]/90 border border-pink-500/20 hover:border-pink-500/40 shadow-xl shadow-pink-950/30 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-pink-500/15 text-pink-300 border border-pink-500/25">
            {cert.category}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {cert.year}
          </span>
        </div>

        <h4 className="text-base font-bold text-white mb-1.5">
          {cert.title}
        </h4>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
          <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span>{cert.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {cert.skillsCovered.map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#0b0813] text-pink-200 border border-pink-500/15"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-pink-500/15 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Verified Credential</span>
      </div>
    </div>
  );

  return (
    <section id="education" className="py-24 relative bg-[#090610] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-pink-500/50" />
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-mono font-medium shadow-sm">
              <span>🌸</span>
              <span>ACADEMIC BACKGROUND &amp; TRAINING</span>
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-pink-500/50" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education &amp; <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 bg-clip-text text-transparent">Certifications</span>
          </h2>
          <p className="mt-3 text-slate-300 max-w-xl text-sm sm:text-base">
            Formal engineering degree foundation alongside specialized industry training in Full Stack and Python development.
          </p>
        </div>

        {/* Dual Column Layout: Education vs Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Education */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold mb-2">
              <GraduationCap className="w-4 h-4 text-pink-400" />
              <span>Formal Education</span>
            </div>

            {educationData.map((edu, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-[#140e20]/90 border border-pink-500/25 hover:border-pink-500/45 shadow-2xl shadow-pink-950/40 backdrop-blur-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    B.Tech Degree
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    <span>{edu.duration}</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {edu.degree}
                </h3>

                <p className="text-sm font-medium text-pink-200/90 mb-4">
                  {edu.institution}
                </p>

                <div className="p-4 rounded-2xl bg-[#0b0813] border border-pink-500/15">
                  <div className="text-xs font-mono text-pink-300 mb-1.5 font-semibold">
                    Core Academic Foundations
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Developed rigorous problem-solving, analytical computation, and project execution rigor throughout the four-year engineering program.
                  </p>
                </div>
              </div>
            ))}

            {/* Transition to Software Engineering Card */}
            <div className="p-5 rounded-2xl bg-[#130d1e]/80 border border-pink-500/20">
              <div className="flex items-center gap-2 text-pink-300 font-bold text-xs mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Interdisciplinary Agility</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seamlessly integrated disciplined engineering fundamentals with modern full-stack software development methodologies.
              </p>
            </div>
          </div>

          {/* Right Column: Specialized Training & Certifications */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold mb-2">
              <Award className="w-4 h-4 text-pink-400" />
              <span>Verified Certifications &amp; Technical Training</span>
            </div>

            {/* Mobile View: CardCarousel */}
            <div className="block sm:hidden">
              <CardCarousel>
                {certificationsData.map((cert, idx) => renderCertCard(cert, idx))}
              </CardCarousel>
            </div>

            {/* Desktop / Tablet View: Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4">
              {certificationsData.map((cert, idx) => renderCertCard(cert, idx))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
