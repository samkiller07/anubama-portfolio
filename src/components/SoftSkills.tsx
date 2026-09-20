import React from 'react';
import { 
  Lightbulb, 
  Cpu, 
  Users, 
  MessageSquare, 
  Zap, 
  Sparkles, 
  Clock
} from 'lucide-react';
import { interpersonalSkills } from '../data/portfolioData';
import { CardCarousel } from './CardCarousel';

const iconMap: Record<string, React.ReactNode> = {
  Lightbulb: <Lightbulb className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
};

export const SoftSkills: React.FC = () => {
  const renderSkillCard = (skill: typeof interpersonalSkills[0], idx: number) => (
    <div
      key={skill.name}
      className="h-full p-6 rounded-3xl bg-[#140e20]/90 border border-pink-500/20 hover:border-pink-500/40 shadow-xl shadow-pink-950/30 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        <div className="w-11 h-11 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-105 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 shadow-md">
          {iconMap[skill.icon] || <Sparkles className="w-5 h-5" />}
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors mb-2">
          {skill.name}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          {skill.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-pink-500/15 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>Attribute 0{idx + 1}</span>
        <span className="text-pink-300 font-semibold">&bull; Core Strength</span>
      </div>
    </div>
  );

  return (
    <section id="soft-skills" className="py-24 relative bg-[#0c0814] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-[130px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-pink-500/50" />
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-mono font-medium shadow-sm">
              <span>🌸</span>
              <span>PROFESSIONAL ATTRIBUTES</span>
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-pink-500/50" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interpersonal &amp; <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 bg-clip-text text-transparent">Soft Skills</span>
          </h2>
          <p className="mt-3 text-slate-300 max-w-xl text-sm sm:text-base">
            Essential collaborative qualities that empower effective teamwork, rapid adaptation, and reliable software delivery.
          </p>
        </div>

        {/* Mobile View: CardCarousel */}
        <div className="block sm:hidden">
          <CardCarousel>
            {interpersonalSkills.map((skill, idx) => renderSkillCard(skill, idx))}
          </CardCarousel>
        </div>

        {/* Desktop View: Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {interpersonalSkills.map((skill, idx) => (
            <div
              key={skill.name}
              className={idx === 6 ? 'sm:col-span-2 lg:col-span-3 xl:col-span-1' : ''}
            >
              {renderSkillCard(skill, idx)}
            </div>
          ))}
        </div>

        {/* Collaboration Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-[#140e1f] via-[#20122b]/60 to-[#140e1f] border border-pink-500/30 text-center shadow-xl shadow-pink-950/40">
          <p className="text-sm text-pink-100/95 max-w-2xl mx-auto font-medium italic">
            &ldquo;Combining analytical logic with open team collaboration and an eagerness to learn ensures high code quality, productive team dynamics, and consistent project progress.&rdquo;
          </p>
        </div>

      </div>
    </section>
  );
};
