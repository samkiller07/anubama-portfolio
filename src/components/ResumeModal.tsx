import React from 'react';
import { 
  X, 
  FileDown, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin,
  Info
} from 'lucide-react';
import { personalInfo, educationData, certificationsData } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, onShowToast }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = personalInfo.resumePath;
    link.download = 'Anubama_M_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('🌸 Downloading resume: Anubama_M_Resume.pdf');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#140e20] border border-pink-500/30 shadow-2xl shadow-pink-950/60 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close resume dialog"
          className="absolute top-5 right-5 p-2 rounded-xl bg-pink-950/40 text-pink-300 hover:text-white hover:bg-pink-900/50 border border-pink-500/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
            <FileDown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Anubama M &bull; Resume
            </h3>
            <p className="text-xs text-pink-300/80 font-mono">
              Software Developer &bull; Immediate Joiner &bull; Chennai
            </p>
          </div>
        </div>

        {/* Download Action Strip */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-[#180f24] to-[#140e20] border border-pink-500/30 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-pink-200 block">
              Official PDF Resume Document
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              File: /resume/Anubama_M_Resume.pdf
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 shadow-lg shadow-pink-500/20 transition-all"
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <a
              href={personalInfo.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-pink-300 bg-pink-950/50 hover:bg-pink-900/60 border border-pink-500/30"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Informative Note */}
        <div className="p-3.5 rounded-2xl bg-[#0b0813] border border-pink-500/15 text-[11px] text-slate-300 flex items-start gap-2 mb-6">
          <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
          <span>
            The portfolio is configured to serve the official resume from <code className="text-pink-300 bg-pink-950/60 px-1.5 py-0.5 rounded font-mono">/resume/Anubama_M_Resume.pdf</code>.
          </span>
        </div>

        {/* Summary Resume Preview Section */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 border-t border-pink-500/15 pt-5">
          
          {/* Objective */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold block mb-1">
              Career Objective
            </span>
            <p className="text-slate-300 leading-relaxed bg-[#0b0813] p-3.5 rounded-2xl border border-pink-500/15 text-xs">
              {personalInfo.about.summary}
            </p>
          </div>

          {/* Education */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold block mb-1">
              Education
            </span>
            <div className="bg-[#0b0813] p-3.5 rounded-2xl border border-pink-500/15">
              <div className="font-semibold text-white">{educationData[0].degree}</div>
              <div className="text-xs text-slate-400">{educationData[0].institution} ({educationData[0].duration})</div>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold block mb-1">
              Certifications &amp; Training
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {certificationsData.map((c, i) => (
                <div key={i} className="bg-[#0b0813] p-3 rounded-2xl border border-pink-500/15">
                  <div className="font-semibold text-white text-xs">{c.title}</div>
                  <div className="text-[11px] text-slate-400">{c.location} &bull; {c.year}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-pink-400" /> {personalInfo.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-pink-400" /> {personalInfo.phone}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-pink-400" /> {personalInfo.location}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
