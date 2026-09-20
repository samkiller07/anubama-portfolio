import React, { useState, useEffect } from 'react';
import { VisitorComment } from '../types';
import { commentService } from '../services/commentService';
import { MessageSquare, Star, Send, Sparkles, Quote, CornerDownRight } from 'lucide-react';

interface CommentsProps {
  onShowToast: (message: string) => void;
}

export const Comments: React.FC<CommentsProps> = ({ onShowToast }) => {
  const [comments, setComments] = useState<VisitorComment[]>([]);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(false);
      setComments(data);
    } catch (e) {
      console.error('Error fetching comments:', e);
    }
  };

  useEffect(() => {
    loadComments();

    const handleCommentsChanged = () => {
      loadComments();
    };

    window.addEventListener('anubama-comments-changed', handleCommentsChanged);
    return () => window.removeEventListener('anubama-comments-changed', handleCommentsChanged);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) return;

    setIsSubmitting(true);
    try {
      await commentService.addComment({
        name: name.trim(),
        role: role.trim() || undefined,
        company: company.trim() || undefined,
        comment: commentText.trim(),
        rating
      });

      setName('');
      setRole('');
      setCompany('');
      setCommentText('');
      setRating(5);
      setIsOpenForm(false);
      onShowToast('🌸 Thank you for your warm endorsement and feedback!');
      await loadComments();
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="comments" className="py-24 relative bg-[#090610] overflow-hidden">
      {/* Background Sakura Watermark */}
      <div className="absolute left-1/2 -top-20 -translate-x-1/2 w-[700px] h-[700px] bg-pink-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Branch Line */}
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 mb-3">
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-pink-500/40" />
        <span className="text-pink-400 text-xs font-mono tracking-widest uppercase flex items-center gap-1.5">
          <span>🌸</span> <span>GUESTBOOK &amp; TESTIMONIALS</span>
        </span>
        <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-pink-500/40" />
      </div>

      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Recommendations &amp; Community Notes
        </h2>
        <p className="mt-3 text-sm sm:text-base text-pink-200/70 max-w-2xl mx-auto">
          Thoughts, endorsements, and feedback from mentors, peers, and collaborators with verified author responses.
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsOpenForm(!isOpenForm)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-950/60 hover:bg-pink-900/60 text-pink-200 border border-pink-500/40 text-xs sm:text-sm font-semibold shadow-lg shadow-pink-950/50 hover:shadow-pink-500/10 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>{isOpenForm ? 'Close Form' : 'Leave an Endorsement / Note'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Write Note Form */}
        {isOpenForm && (
          <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-[#130d1e]/90 border border-pink-500/30 backdrop-blur-xl shadow-2xl shadow-pink-950/40 animate-fadeIn max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-pink-300">
              <MessageSquare className="w-5 h-5 text-pink-400" />
              <h3 className="font-bold text-white text-base">Write a Note for Anubama</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-pink-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Krishnan"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#090610] border border-pink-500/20 text-white text-sm focus:border-pink-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-pink-300 mb-1">Your Role / Relation</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead Engineer / Project Mentor"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#090610] border border-pink-500/20 text-white text-sm focus:border-pink-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-pink-300 mb-1">Organization / College (Optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Tech Corp / KARE"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#090610] border border-pink-500/20 text-white text-sm focus:border-pink-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-pink-300 mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 text-pink-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${s <= rating ? 'fill-pink-400 text-pink-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-pink-300 mb-1">Message / Note *</label>
                <textarea
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on Anubama's skills, dedication, or project collaboration..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#090610] border border-pink-500/20 text-white text-sm focus:border-pink-400 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenForm(false)}
                  className="px-4 py-2 rounded-xl bg-pink-950/40 text-pink-300 text-xs font-medium hover:bg-pink-900/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-pink-500/25 flex items-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Posting...' : 'Post Endorsement'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Display Comments List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 rounded-3xl bg-[#140e20]/90 border border-pink-500/20 hover:border-pink-500/40 transition-all shadow-xl shadow-pink-950/30 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                {/* Header & Rating */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${comment.avatarColor || 'bg-rose-500'} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {comment.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-snug">{comment.name}</h4>
                      <div className="text-xs text-pink-200/80">
                        {comment.role || 'Visitor'} {comment.company && `• ${comment.company}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: comment.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                    ))}
                  </div>
                </div>

                {/* Comment Body */}
                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-pink-500/20 absolute -top-1 -left-1 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-slate-300 pl-5 italic leading-relaxed">
                    "{comment.comment}"
                  </p>
                </div>
              </div>

              {/* Verified Author Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-pink-500/15 space-y-2">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3 rounded-2xl bg-[#190f28] border border-pink-500/25 flex items-start gap-2.5 shadow-inner"
                    >
                      <CornerDownRight className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-semibold text-pink-300 inline-flex items-center gap-1">
                          <span>🌸</span> <span>{reply.name}</span>
                        </span>
                        <p className="text-slate-300 mt-0.5 leading-relaxed">
                          {reply.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
