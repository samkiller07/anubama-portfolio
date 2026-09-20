import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Instagram,
  Send, 
  Copy, 
  Check, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { messageService } from '../services/messageService';

interface ContactProps {
  onShowToast: (message: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    onShowToast(`Copied ${label} to clipboard!`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onShowToast('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await messageService.sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim()
      });

      setIsSent(true);
      onShowToast('🌸 Thank you! Your message has been sent to Anubama.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSent(false), 6000);
    } catch (err) {
      console.error('Error sending message:', err);
      onShowToast('Error sending message. Please try emailing directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#090610] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-pink-500/50" />
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-mono font-medium shadow-sm">
              <span>🌸</span>
              <span>COMMUNICATION &amp; HIRING</span>
            </div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-pink-500/50" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get in <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-pink-200 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="mt-3 text-slate-300 max-w-xl text-sm sm:text-base">
            Open for software developer roles, full-stack opportunities, and technical discussions. Immediate joiner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info & Channels */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Availability Badge Card */}
            <div className="p-6 rounded-3xl bg-[#140e20]/90 border border-pink-500/25 shadow-2xl shadow-pink-950/40 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-mono font-semibold mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
                <span>IMMEDIATE JOINER STATUS</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Ready for Engineering Opportunities
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Actively seeking Software Developer / Full-Stack Engineer roles in Chennai, hybrid, or remote setups.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              
              {/* Email Card */}
              <div className="p-4 rounded-2xl bg-[#130d1e]/80 border border-pink-500/20 hover:border-pink-500/40 transition-all flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] font-mono text-slate-400 block">Email Address</span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-sm font-semibold text-white hover:text-pink-300 transition-colors truncate block"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(personalInfo.email, 'Email')}
                  aria-label="Copy Email"
                  className="p-2 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 text-pink-300 hover:text-white transition-colors shrink-0 border border-pink-500/20"
                >
                  {copiedField === 'Email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone Card */}
              <div className="p-4 rounded-2xl bg-[#130d1e]/80 border border-pink-500/20 hover:border-pink-500/40 transition-all flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">Phone Number</span>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="text-sm font-semibold text-white hover:text-pink-300 transition-colors"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(personalInfo.phone, 'Phone')}
                  aria-label="Copy Phone"
                  className="p-2 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 text-pink-300 hover:text-white transition-colors shrink-0 border border-pink-500/20"
                >
                  {copiedField === 'Phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-[#130d1e]/80 border border-pink-500/20 hover:border-pink-500/40 transition-all flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">Location</span>
                    <span className="text-sm font-semibold text-white">
                      {personalInfo.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(personalInfo.location, 'Location')}
                  aria-label="Copy Location"
                  className="p-2 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 text-pink-300 hover:text-white transition-colors shrink-0 border border-pink-500/20"
                >
                  {copiedField === 'Location' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* LinkedIn Card */}
              <div className="p-4 rounded-2xl bg-[#130d1e]/80 border border-pink-500/20 hover:border-pink-500/40 transition-all flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 shrink-0">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">Professional Profile</span>
                    <a
                      href={personalInfo.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white hover:text-pink-300 transition-colors"
                    >
                      linkedin.com/in/anubama2003
                    </a>
                  </div>
                </div>

                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 text-pink-300 hover:text-white transition-colors shrink-0 border border-pink-500/20"
                >
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Instagram Card */}
              <div className="p-4 rounded-2xl bg-[#130d1e]/80 border border-pink-500/20 hover:border-pink-500/40 transition-all flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">Instagram Profile</span>
                    <a
                      href={personalInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-white hover:text-pink-300 transition-colors"
                    >
                      @anubama_murugesan_
                    </a>
                  </div>
                </div>

                <a
                  href={personalInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 text-pink-300 hover:text-white transition-colors shrink-0 border border-pink-500/20"
                >
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-[#140e20]/95 border border-pink-500/25 shadow-2xl shadow-pink-950/40 backdrop-blur-xl relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-2">
                Send Direct Message
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                Fill out the form below to initiate recruiter discussions, project inquiries, or schedule an interview.
              </p>

              {isSent && (
                <div className="p-4 mb-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2 animate-fadeIn">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Your message was sent successfully! Anubama will respond shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe / Tech Recruiter"
                      className="w-full px-4 py-3 rounded-2xl bg-[#0b0813] border border-pink-500/20 focus:border-pink-400 text-white text-sm outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 rounded-2xl bg-[#0b0813] border border-pink-500/20 focus:border-pink-400 text-white text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1.5">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Software Developer Opening / React Role"
                    className="w-full px-4 py-3 rounded-2xl bg-[#0b0813] border border-pink-500/20 focus:border-pink-400 text-white text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hello Anubama, we would like to invite you for an interview..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#0b0813] border border-pink-500/20 focus:border-pink-400 text-white text-sm outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:via-rose-400 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-pink-500/25 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Inbound Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
