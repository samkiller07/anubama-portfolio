import React from 'react';
import { X, ExternalLink, Github, CheckCircle2, Calendar, Layers } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null;

  const displayCategory = project.category?.trim() || 'Other';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#140e1f] border border-pink-500/30 shadow-2xl shadow-pink-950/60 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project modal"
          className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-pink-950/60 text-pink-300 hover:text-white hover:bg-pink-900/70 border border-pink-500/30 transition-colors focus:outline-none backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Project Header Image if available */}
        {project.imageUrl && (
          <div className="w-full h-56 sm:h-72 bg-[#090610] relative overflow-hidden border-b border-pink-500/20 shrink-0">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140e1f] via-transparent to-black/30" />
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* Modal Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                {displayCategory}
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-slate-300 bg-[#0b0813] px-2.5 py-1 rounded-full border border-pink-500/15">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                <span>Year: {project.year || '2026'}</span>
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {project.title}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {project.description || project.shortDescription}
            </p>
          </div>

          {/* Key Features Section */}
          {project.keyFeatures && project.keyFeatures.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0b0813] border border-pink-500/15">
              <div className="flex items-center gap-2 text-pink-300 font-bold text-sm mb-3">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Verified Key Features &amp; Capabilities</span>
              </div>
              <ul className="space-y-2.5">
                {project.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="text-pink-400 font-bold mt-0.5 shrink-0">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technology Stack */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" />
                <span>Technology Stack</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-[#1c1228] text-pink-200 border border-pink-500/25"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-pink-500/20">
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-pink-950/50 hover:bg-pink-900/60 border border-pink-500/30 transition-all shadow-md"
                >
                  <Github className="w-4 h-4 text-pink-400" />
                  <span>View GitHub Repository</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
