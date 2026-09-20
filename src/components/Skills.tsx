import React, { useState } from 'react';
import { 
  Code2, 
  Layout, 
  Server, 
  Database, 
  Network, 
  GitBranch, 
  Terminal
} from 'lucide-react';
import { skillsData } from '../data/portfolioData';
import { CardCarousel } from './CardCarousel';

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-5 h-5" />,
  Layout: <Layout className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Network: <Network className="w-5 h-5" />,
  GitBranch: <GitBranch className="w-5 h-5" />,
};

export const Skills: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCategories = selectedCategory === 'all'
    ? skillsData
    : skillsData.filter((c) => c.name === selectedCategory);

  const renderCategoryCard = (category: typeof skillsData[0]) => (
    <div
      key={category.name}
      className="h-full p-6 rounded-3xl bg-[#130e1f]/90 border border-pink-500/20 hover:border-pink-500/40 shadow-2xl shadow-pink-950/30 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Subtle petal highlight in corner */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-500/10 to-transparent pointer-events-none" />

      <div>
        {/* Category Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-400 group-hover:scale-105 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 shadow-md">
            {iconMap[category.iconName] || <Code2 className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
              {category.name}
            </h3>
            <p className="text-xs text-slate-400">
              {category.description}
            </p>
          </div>
        </div>

        {/* Skills Item Pills */}
        <div className="mt-5 space-y-2.5">
          {category.skills.map((skill) => (
            <div
              key={skill.name}
              className="p-3 rounded-2xl bg-[#0b0813] border border-pink-500/15 hover:border-pink-500/35 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs sm:text-sm text-slate-100 font-mono">
                  {skill.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              </div>
              {skill.description && (
                <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                  {skill.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom tag */}
      <div className="pt-4 mt-4 border-t border-pink-500/15 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{category.skills.length} verified technologies</span>
        <span className="text-pink-300 font-semibold group-hover:translate-x-0.5 transition-transform">&bull; active stack</span>
      </div>
    </div>
  );

  return (
    <section id="skills" className="py-24 relative bg-[#090610] overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-pink-500/50" />
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-mono font-medium shadow-sm">
              <span>🌸</span>
              <span>TECHNICAL CAPABILITIES</span>
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-pink-500/50" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills &amp; <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 bg-clip-text text-transparent">Technologies</span>
          </h2>
          <p className="mt-3 text-slate-300 max-w-xl text-sm sm:text-base">
            Proficient across frontend libraries, enterprise backend frameworks, databases, and version control systems.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 max-w-3xl">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 font-semibold'
                  : 'bg-[#150f22]/90 text-slate-300 border border-pink-500/20 hover:border-pink-500/40 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {skillsData.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.name
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 font-semibold'
                    : 'bg-[#150f22]/90 text-slate-300 border border-pink-500/20 hover:border-pink-500/40 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile View: CardCarousel */}
        <div className="block md:hidden">
          <CardCarousel>
            {filteredCategories.map((category) => renderCategoryCard(category))}
          </CardCarousel>
        </div>

        {/* Desktop View: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => renderCategoryCard(category))}
        </div>

        {/* Technical Architecture Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-[#140e1f] via-[#20122b]/60 to-[#140e1f] border border-pink-500/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left shadow-xl shadow-pink-950/40">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-300 shadow-md">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">
                Full-Stack Architecture &amp; Clean Code Focus
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Structured components, decoupled RESTful APIs, and relational data modeling with continuous learning agility.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
