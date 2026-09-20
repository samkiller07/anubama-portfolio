import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  Calendar, 
  Sparkles,
  ArrowUpRight,
  Maximize2,
  Code2,
  Server,
  Layers,
  Layout
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { categoryService } from '../services/categoryService';
import { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { CardCarousel } from './CardCarousel';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  const loadProjectsAndCategories = async () => {
    try {
      const data = await projectService.getProjects(false);
      setProjects(data);
      const dynamicCats = categoryService.getCategories();
      setCategories(['all', ...dynamicCats]);
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  useEffect(() => {
    loadProjectsAndCategories();

    const handleProjectsChanged = () => {
      loadProjectsAndCategories();
    };

    const handleCategoriesChanged = () => {
      const dynamicCats = categoryService.getCategories();
      setCategories(['all', ...dynamicCats]);
    };

    window.addEventListener('anubama-projects-changed', handleProjectsChanged);
    window.addEventListener('anubama-categories-changed', handleCategoriesChanged);

    return () => {
      window.removeEventListener('anubama-projects-changed', handleProjectsChanged);
      window.removeEventListener('anubama-categories-changed', handleCategoriesChanged);
    };
  }, []);

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => (p.category || 'Other').toLowerCase() === selectedCategory.toLowerCase());

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const otherProjects = filteredProjects.filter((p) => !p.featured);

  const getCategoryIcon = (category?: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('front')) return <Layout className="w-5 h-5 text-pink-400" />;
    if (cat.includes('back')) return <Server className="w-5 h-5 text-pink-400" />;
    if (cat.includes('stack') || cat.includes('full')) return <Layers className="w-5 h-5 text-pink-400" />;
    return <Code2 className="w-5 h-5 text-pink-400" />;
  };

  const renderProjectCard = (project: Project, isFeaturedCard: boolean = false) => {
    const displayCategory = project.category?.trim() || 'Other';

    return (
      <div
        key={project.id}
        className={`h-full rounded-3xl bg-[#140e20]/95 border ${
          isFeaturedCard ? 'border-pink-500/30' : 'border-pink-500/20'
        } hover:border-pink-500/50 shadow-2xl shadow-pink-950/40 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden backdrop-blur-xl`}
      >
        {/* Project Media Banner / Styled Fallback Header */}
        {project.imageUrl ? (
          <div className={`w-full ${isFeaturedCard ? 'h-48 sm:h-56' : 'h-40'} bg-[#0b0813] relative overflow-hidden border-b border-pink-500/20`}>
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140e20] via-transparent to-transparent" />
          </div>
        ) : (
          <div className={`w-full ${isFeaturedCard ? 'h-36' : 'h-24'} bg-gradient-to-r from-[#1f122e] via-[#241336] to-[#1a0e28] border-b border-pink-500/20 relative p-5 flex items-center justify-between overflow-hidden`}>
            <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 text-pink-500/10 scale-125 pointer-events-none">
              {getCategoryIcon(displayCategory)}
            </div>
            <div className="relative z-10 max-w-[80%]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400/80 font-bold block mb-1">
                {displayCategory}
              </span>
              <div className="text-sm font-bold text-white tracking-tight truncate">
                {project.title}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-300 shadow-md shrink-0">
              {getCategoryIcon(displayCategory)}
            </div>
          </div>
        )}

        <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between">
          <div>
            {/* Header meta */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {displayCategory}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>{project.year || '2026'}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectModal(project)}
                aria-label={`Inspect ${project.title}`}
                className="p-1.5 rounded-lg bg-pink-950/40 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors border border-pink-500/20"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-pink-300 transition-colors mb-2">
              {project.title}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
              {project.shortDescription || project.description}
            </p>

            {/* Key features pill list (For featured cards) */}
            {isFeaturedCard && project.keyFeatures && project.keyFeatures.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-[#0b0813] border border-pink-500/15 mb-4">
                <div className="text-[11px] font-mono text-pink-300/90 mb-1.5 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Core Implementation Features</span>
                </div>
                <ul className="space-y-1">
                  {project.keyFeatures.slice(0, 2).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                      <span className="text-pink-400 font-bold shrink-0">•</span>
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Badges */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {(project.technologies || []).slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#1a1127] text-pink-200 border border-pink-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Actions footer */}
          <div className="pt-3 border-t border-pink-500/15 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveProjectModal(project)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors"
            >
              <span>Detailed Case Study</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-pink-950/40 text-pink-300 hover:text-white hover:bg-pink-900/50 border border-pink-500/20 transition-all"
                  title="View Source on GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-pink-950/40 text-pink-300 hover:text-white hover:bg-pink-900/50 border border-pink-500/20 transition-all"
                  title="Live Demo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" className="py-24 relative bg-[#0c0814] overflow-hidden">
      {/* Sakura background lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-pink-500/50" />
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-mono font-medium shadow-sm">
              <span>🌸</span>
              <span>ENGINEERING CASE STUDIES</span>
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-pink-500/50" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="mt-3 text-slate-300 max-w-xl text-sm sm:text-base">
            Verified software engineering projects featuring frontend components, backend RESTful APIs, and database integration.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 capitalize ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25 font-semibold'
                    : 'bg-[#150f22]/90 text-slate-300 border border-pink-500/20 hover:border-pink-500/40 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile View: High Quality Card Carousel */}
        <div className="block md:hidden mb-8">
          <CardCarousel>
            {filteredProjects.map((project) => renderProjectCard(project, project.featured))}
          </CardCarousel>
        </div>

        {/* Desktop View: Grid Layout */}
        <div className="hidden md:block">
          {/* Flagship Projects Spotlight */}
          {selectedCategory === 'all' && featuredProjects.length > 0 && (
            <div className="mb-14 space-y-6">
              <div className="text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Flagship Core Projects</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredProjects.map((project) => renderProjectCard(project, true))}
              </div>
            </div>
          )}

          {/* Secondary & Filtered Project Grid */}
          <div>
            {selectedCategory === 'all' && (
              <div className="text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold flex items-center gap-2 mb-6">
                <FolderGit2 className="w-4 h-4 text-pink-400" />
                <span>Full Repository &amp; Applications Showcase</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === 'all' ? otherProjects : filteredProjects).map((project) =>
                renderProjectCard(project, false)
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Case Study Details Modal */}
      <ProjectModal
        project={activeProjectModal}
        isOpen={Boolean(activeProjectModal)}
        onClose={() => setActiveProjectModal(null)}
      />
    </section>
  );
};
