import React, { useState, useEffect, useRef } from 'react';
import { Project, ContactMessage, VisitorComment } from '../../types';
import { projectService } from '../../services/projectService';
import { messageService } from '../../services/messageService';
import { commentService } from '../../services/commentService';
import { profileService } from '../../services/profileService';
import { storageService } from '../../services/storageService';
import { authService, UserSession } from '../../services/authService';
import { AdminProjectForm } from './AdminProjectForm';
import { isSupabaseConfigured, checkSupabaseHealth } from '../../lib/supabase';
import {
  LayoutDashboard,
  FolderGit2,
  Mail,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  LogOut,
  ShieldCheck,
  RefreshCw,
  Search,
  Sliders,
  CornerDownRight,
  Send,
  Image as ImageIcon,
  AlertTriangle,
  User,
  UploadCloud,
  Loader2,
  Menu,
  X,
  Check,
  KeyRound
} from 'lucide-react';

interface AdminDashboardProps {
  session: UserSession;
  onLogout: () => void;
  onNavigateHome: () => void;
  onShowToast: (msg: string) => void;
}

type TabType = 'overview' | 'projects' | 'messages' | 'comments' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  session,
  onLogout,
  onNavigateHome,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [comments, setComments] = useState<VisitorComment[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Mobile navigation drawer state
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Profile Picture Upload States
  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [pendingProfileImage, setPendingProfileImage] = useState<string | null>(null);
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(isSupabaseConfigured());

  // Security / Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Project Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Search & Filter state
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilterCat, setProjectFilterCat] = useState('all');

  // Admin Reply State
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Delete Confirmation States
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const loadAllData = async () => {
    try {
      const [projs, msgs, comms, profileImg, isHealthy] = await Promise.all([
        projectService.getProjects(true),
        messageService.getMessages(),
        commentService.getComments(true),
        profileService.fetchProfileImage(),
        checkSupabaseHealth()
      ]);
      setProjects(projs);
      setMessages(msgs);
      setComments(comms);
      setProfileImage(profileImg);
      setIsDbConnected(isHealthy);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
    const unsubscribeProfile = profileService.onProfileImageChange((newImg) => {
      setProfileImage(newImg);
    });
    return () => {
      unsubscribeProfile();
    };
  }, []);

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEditProject = (proj: Project) => {
    setEditingProject(proj);
    setIsFormOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await projectService.deleteProject(projectToDelete.id);
      onShowToast(`Deleted project: ${projectToDelete.title}`);
      setProjectToDelete(null);
      await loadAllData();
    } catch (err) {
      console.error('Error deleting project:', err);
      onShowToast('Failed to delete project');
    }
  };

  const handleSaveProject = async (projectData: Partial<Project>) => {
    if (editingProject) {
      await projectService.updateProject(editingProject.id, projectData);
      onShowToast(`Updated project: ${projectData.title || editingProject.title}`);
    } else {
      await projectService.createProject(projectData as any);
      onShowToast(`Created project: ${projectData.title}`);
    }
    await loadAllData();
  };

  const handleToggleFeatured = async (proj: Project) => {
    await projectService.updateProject(proj.id, { featured: !proj.featured });
    onShowToast(`${proj.title} ${!proj.featured ? 'marked as featured' : 'unpinned'}`);
    await loadAllData();
  };

  const handleToggleStatus = async (proj: Project) => {
    const nextStatus = proj.status === 'published' ? 'draft' : 'published';
    await projectService.updateProject(proj.id, { status: nextStatus });
    onShowToast(`Status updated to ${nextStatus}`);
    await loadAllData();
  };

  const handleToggleMessageStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'read' ? 'unread' : 'read';
    await messageService.updateMessageStatus(id, nextStatus as any);
    onShowToast(`Message marked as ${nextStatus}`);
    await loadAllData();
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await messageService.deleteMessage(messageToDelete);
      onShowToast('Inquiry message deleted');
      setMessageToDelete(null);
      await loadAllData();
    } catch (err) {
      console.error('Error deleting message:', err);
      onShowToast('Failed to delete message');
    }
  };

  const handleToggleCommentStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'approved' ? 'hidden' : 'approved';
    await commentService.updateCommentStatus(id, nextStatus as any);
    onShowToast(`Comment status: ${nextStatus}`);
    await loadAllData();
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await commentService.deleteComment(commentToDelete);
      onShowToast('Comment and replies deleted');
      setCommentToDelete(null);
      await loadAllData();
    } catch (err) {
      console.error('Error deleting comment:', err);
      onShowToast('Failed to delete comment');
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (window.confirm('Delete this admin reply?')) {
      try {
        await commentService.deleteReply(replyId);
        onShowToast('Reply removed');
        await loadAllData();
      } catch (err) {
        console.error('Error deleting reply:', err);
        onShowToast('Failed to delete reply');
      }
    }
  };

  const handleSendReply = async (parentId: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      await commentService.addReply(parentId, replyText.trim(), 'Anubama M');
      onShowToast('🌸 Admin reply published!');
      setReplyText('');
      setReplyingCommentId(null);
      await loadAllData();
    } catch (err) {
      console.error('Error adding reply:', err);
      onShowToast('Failed to post reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = storageService.validateImageFile(file);
    if (!validation.valid) {
      onShowToast(validation.error || 'Invalid image file.');
      return;
    }

    setIsUploadingProfile(true);
    try {
      const dataUrl = await storageService.readFileAsDataUrl(file);
      if (dataUrl && dataUrl.startsWith('data:image/')) {
        setSelectedProfileFile(file);
        setPendingProfileImage(dataUrl);
        onShowToast('Image loaded for preview. Click "Save Profile Picture" to apply.');
      }
    } catch (err) {
      console.error('Failed to read profile image:', err);
      onShowToast('Failed to load profile image preview.');
    } finally {
      setIsUploadingProfile(false);
      if (profileInputRef.current) {
        profileInputRef.current.value = '';
      }
    }
  };

  const handleSaveProfileImage = async () => {
    if (!pendingProfileImage) return;
    setIsUploadingProfile(true);
    try {
      let finalImageUrl = pendingProfileImage;
      if (selectedProfileFile) {
        const uploadRes = await storageService.uploadProfileImage(selectedProfileFile);
        if (uploadRes.url) {
          finalImageUrl = uploadRes.url;
        }
      }
      await profileService.setProfileImage(finalImageUrl);
      setProfileImage(finalImageUrl);
      setPendingProfileImage(null);
      setSelectedProfileFile(null);
      onShowToast('🌸 Profile picture saved and published to portfolio!');
    } catch (err: any) {
      console.error('Failed to save profile picture:', err);
      onShowToast(err?.message || 'Failed to save profile picture.');
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const handleCancelProfileImage = () => {
    setPendingProfileImage(null);
    setSelectedProfileFile(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
    onShowToast('Cancelled profile picture change.');
  };

  const handleRemoveProfileImage = async () => {
    if (window.confirm('Remove custom profile picture and revert to the Sakura avatar?')) {
      try {
        await profileService.removeProfileImage();
        setProfileImage(null);
        setPendingProfileImage(null);
        setSelectedProfileFile(null);
        onShowToast('Profile picture removed (reverted to Sakura avatar)');
      } catch (err) {
        console.error('Failed to remove profile image:', err);
        onShowToast('Failed to remove profile picture.');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const trimmedCurrent = currentPassword.trim();
    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedCurrent) {
      setPasswordError('Current password is required.');
      return;
    }

    if (!trimmedNew) {
      setPasswordError('New password is required.');
      return;
    }

    if (trimmedNew.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (trimmedCurrent === trimmedNew) {
      setPasswordError('New password must be different from the current password.');
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await authService.changePassword(trimmedCurrent, trimmedNew, session.email);
      if (res.success) {
        setPasswordSuccess('Password changed successfully.');
        onShowToast('🌸 Admin password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.error || 'Failed to change password.');
        onShowToast(res.error || 'Failed to change password.');
      }
    } catch (err: any) {
      console.error('Password change error:', err);
      setPasswordError(err.message || 'An error occurred while changing password.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleResetProjects = () => {
    if (window.confirm('Reset all projects to Anubama\'s verified default portfolio projects?')) {
      projectService.resetToDefault();
      onShowToast('Reset projects to Anubama default data');
      loadAllData();
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()));
    const matchesCategory = projectFilterCat === 'all' || (p.category || 'Other').toLowerCase() === projectFilterCat.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;
  const publishedProjectsCount = projects.filter((p) => p.status === 'published' || !p.status).length;
  const featuredProjectsCount = projects.filter((p) => p.featured).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: projects.length },
    { id: 'messages', label: 'Inquiries', icon: Mail, badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} new` : messages.length, isHighlight: unreadMessagesCount > 0 },
    { id: 'comments', label: 'Guestbook & Replies', icon: MessageSquare, badge: comments.length },
    { id: 'settings', label: 'Profile & Settings', icon: Sliders, badge: null }
  ];

  return (
    <div className="min-h-screen bg-[#0a0711] text-slate-100 flex flex-col font-sans selection:bg-pink-500/30 selection:text-pink-200">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#120c1d]/95 backdrop-blur-md border-b border-pink-500/20 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Open admin menu"
            className="p-2 rounded-xl bg-pink-950/40 text-pink-300 hover:text-white border border-pink-500/20 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-black shadow-lg shadow-pink-500/20 overflow-hidden shrink-0">
            {profileImage ? (
              <img src={profileImage} alt="Admin Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>🌸</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base tracking-tight truncate">Anubama M Console</span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[11px] font-medium text-pink-200">
                <span className={`w-1.5 h-1.5 rounded-full ${isDbConnected ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                <span>{isDbConnected ? '● Database Connected' : '● Local Mode'}</span>
              </span>
            </div>
            <span className="text-[11px] text-pink-300/60 font-mono hidden sm:inline">
              Session: {session.email}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 text-pink-200 border border-pink-500/30 text-xs font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Live Portfolio</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer / Slide-Over Navigation Sheet */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] bg-[#120d1e] border-r border-pink-500/30 p-5 flex flex-col justify-between shadow-2xl z-10 animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-pink-500/20 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌸</span>
                  <span className="font-bold text-white text-sm">Admin Navigation</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id as TabType);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500/25 to-rose-500/15 text-pink-200 border border-pink-500/40 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-pink-950/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-pink-400" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                            item.isHighlight
                              ? 'bg-rose-500 text-white font-bold animate-pulse'
                              : 'bg-pink-500/20 text-pink-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Database Status */}
            <div className="pt-4 border-t border-pink-500/20 flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              <span className="font-medium text-slate-300">
                {isDbConnected ? 'Database Connected' : 'Local Mode'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex w-64 flex-shrink-0 flex-col gap-1.5 bg-[#120d1e]/80 border border-pink-500/20 rounded-2xl p-3 backdrop-blur-sm self-start sticky top-24">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/10 text-pink-200 border border-pink-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-pink-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-pink-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      item.isHighlight
                        ? 'bg-rose-500 text-white font-bold animate-pulse'
                        : 'bg-pink-500/20 text-pink-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Database Status */}
          <div className="mt-4 pt-4 border-t border-pink-500/15 p-2 flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400' : 'bg-slate-400'}`} />
            <span className="font-medium text-slate-300">
              {isDbConnected ? 'Database Connected' : 'Local Mode'}
            </span>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h1>
                  <p className="text-sm text-slate-400">
                    Live snapshot of Anubama's verified software engineering portfolio
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateProject}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold text-sm shadow-lg shadow-pink-500/20 self-start transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#130e1d]/90 border border-pink-500/25 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider">Total Projects</span>
                    <FolderGit2 className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mt-2">{projects.length}</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <span className="text-emerald-400 font-medium">{publishedProjectsCount} published</span>
                    <span>•</span>
                    <span className="text-pink-300 font-medium">{featuredProjectsCount} featured</span>
                  </div>
                </div>

                <div className="bg-[#130e1d]/90 border border-pink-500/25 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider">Inbound Inquiries</span>
                    <Mail className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mt-2">{messages.length}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    <span className="text-rose-400 font-semibold">{unreadMessagesCount} unread message{unreadMessagesCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="bg-[#130e1d]/90 border border-pink-500/25 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider">Guestbook Feedback</span>
                    <MessageSquare className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mt-2">{comments.length}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Peer &amp; mentor endorsements
                  </div>
                </div>

                <div className="bg-[#130e1d]/90 border border-pink-500/25 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-pink-300 uppercase tracking-wider">Database Status</span>
                    <ShieldCheck className={`w-5 h-5 ${isDbConnected ? 'text-emerald-400' : 'text-pink-400'}`} />
                  </div>
                  <div className="text-lg font-bold text-white mt-2 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                    <span>{isDbConnected ? 'Database Connected' : 'Local Mode'}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {isDbConnected ? 'Anubama Supabase' : 'Isolated Local Storage'}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#130e1d]/90 border border-pink-500/20 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-pink-400" />
                    <span>Quick Project Management</span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Create new case studies with Cover Images, manage publication visibility, or re-order flagship projects.
                  </p>
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleCreateProject}
                      className="px-4 py-2 rounded-xl bg-pink-950/60 border border-pink-500/30 text-pink-200 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Project</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('projects')}
                      className="px-4 py-2 rounded-xl bg-[#0e0a16] border border-pink-500/20 text-slate-300 hover:text-white text-xs font-medium"
                    >
                      View All ({projects.length})
                    </button>
                    <button
                      type="button"
                      onClick={handleResetProjects}
                      className="px-4 py-2 rounded-xl bg-red-950/30 border border-red-500/20 text-red-300 hover:text-white text-xs font-medium"
                    >
                      Reset to Anubama Defaults
                    </button>
                  </div>
                </div>

                <div className="bg-[#130e1d]/90 border border-pink-500/20 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-pink-400" />
                    <span>Profile Picture Quick Status</span>
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#090610] border border-pink-500/30 p-1 flex items-center justify-center overflow-hidden shrink-0">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <User className="w-8 h-8 text-pink-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {profileImage ? 'Custom Profile Picture Active' : 'Default Sakura Avatar'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Active Profile
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className="mt-2 text-xs text-pink-400 hover:text-pink-300 font-semibold"
                      >
                        Change in Settings →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Project Portfolio Management</h1>
                  <p className="text-sm text-slate-400">
                    Create, edit, upload Cover Images, and configure case studies
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetProjects}
                    className="px-3.5 py-2.5 rounded-xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/25 text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateProject}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-500/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search by title, tech stack..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#120d1e] border border-pink-500/20 text-white text-xs sm:text-sm outline-none focus:border-pink-400"
                  />
                </div>
                <select
                  value={projectFilterCat}
                  onChange={(e) => setProjectFilterCat(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#120d1e] border border-pink-500/20 text-white text-xs sm:text-sm outline-none focus:border-pink-400 cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Web Application">Web Application</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Project Cards List */}
              <div className="space-y-3">
                {filteredProjects.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#130e1d]/60 border border-pink-500/20 text-center text-slate-400">
                    No projects found matching your search.
                  </div>
                ) : (
                  filteredProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#130e1d]/90 border border-pink-500/20 hover:border-pink-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        {/* Thumbnail Image / Fallback */}
                        <div className="w-16 h-14 rounded-xl bg-[#0a0711] border border-pink-500/30 overflow-hidden flex items-center justify-center shrink-0">
                          {proj.imageUrl ? (
                            <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-pink-400/60" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm sm:text-base">{proj.title}</span>
                            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono border border-pink-500/30">
                              {proj.category || 'Other'}
                            </span>
                            {proj.featured && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-300" />
                                <span>Featured</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {proj.shortDescription || proj.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(proj)}
                          className={`p-2 rounded-xl border text-xs transition-colors ${
                            proj.featured
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-[#1a1127] text-slate-400 border-pink-500/15 hover:text-white'
                          }`}
                          title={proj.featured ? 'Unpin featured' : 'Pin as featured'}
                        >
                          <Star className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(proj)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                            proj.status === 'published' || !proj.status
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {proj.status === 'published' || !proj.status ? 'Published' : 'Draft'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditProject(proj)}
                          className="p-2 rounded-xl bg-pink-950/40 text-pink-300 hover:text-white border border-pink-500/20"
                          title="Edit project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setProjectToDelete({ id: proj.id, title: proj.title })}
                          className="p-2 rounded-xl bg-red-950/40 text-red-300 hover:text-white border border-red-500/20"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INQUIRIES & MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Inbound Contact Inquiries</h1>
                  <p className="text-sm text-slate-400">
                    Messages submitted by recruiters, hiring managers, and visitors via Contact Form
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#130e1d]/60 border border-pink-500/20 text-center text-slate-400">
                    No inbound inquiries received yet.
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-6 rounded-2xl border transition-all ${
                        m.status === 'unread'
                          ? 'bg-[#191026] border-pink-500/40 shadow-lg shadow-pink-950/30'
                          : 'bg-[#130e1d]/80 border-pink-500/20'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300 font-bold text-xs">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white text-base">{m.name}</span>
                            <span className="text-xs text-pink-300/80 ml-2 font-mono">({m.email})</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {new Date(m.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-pink-300 mb-2">
                        Subject: {m.subject}
                      </div>

                      <div className="p-4 rounded-xl bg-[#0b0813] border border-pink-500/10 text-sm text-slate-200 leading-relaxed mb-4">
                        {m.message}
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-pink-500/15">
                        <a
                          href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Inquiry')}`}
                          className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleToggleMessageStatus(m.id, m.status)}
                          className="text-xs text-slate-300 hover:text-white"
                        >
                          Mark as {m.status === 'read' ? 'Unread' : 'Read'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMessageToDelete(m.id)}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GUESTBOOK & REPLIES */}
          {activeTab === 'comments' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Guestbook &amp; Replies</h1>
                  <p className="text-sm text-slate-400">
                    Moderate feedback, post official author responses, and manage endorsements
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-6 rounded-2xl bg-[#130e1d]/90 border border-pink-500/20 space-y-4"
                  >
                    {/* Parent Comment Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${c.avatarColor || 'bg-rose-500'} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">{c.name}</span>
                            {c.role && <span className="text-xs text-pink-300 font-medium">({c.role})</span>}
                            {c.company && <span className="text-xs text-slate-400">• {c.company}</span>}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {new Date(c.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full ${
                            c.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {c.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleCommentStatus(c.id, c.status)}
                          className="px-3 py-1.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-pink-200 text-xs font-medium hover:bg-pink-900/50 transition-colors"
                        >
                          {c.status === 'approved' ? 'Hide' : 'Approve'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setCommentToDelete(c.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors"
                          title="Delete comment and replies"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Comment Body */}
                    <div className="p-4 rounded-xl bg-[#0c0814] border border-pink-500/10 text-sm text-slate-200 italic leading-relaxed">
                      "{c.comment}"
                    </div>

                    {/* NESTED REPLIES LIST */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="pl-4 sm:pl-8 space-y-3 border-l-2 border-pink-500/30">
                        <div className="text-xs font-mono text-pink-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>Author Responses ({c.replies.length})</span>
                        </div>

                        {c.replies.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-4 rounded-xl bg-[#190f28] border border-pink-500/25 flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-inner"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-pink-300 text-xs font-semibold border border-pink-500/40">
                                  <span>🌸</span> <span>{rep.name} (Author)</span>
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {new Date(rep.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-pink-100 pt-1 leading-relaxed">
                                {rep.comment}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteReply(rep.id)}
                              className="self-end sm:self-start p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
                              title="Delete reply"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* INLINE REPLY TRIGGER / FORM */}
                    <div className="pt-2">
                      {replyingCommentId === c.id ? (
                        <div className="p-4 rounded-xl bg-[#150f22] border border-pink-500/30 space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between text-xs text-pink-300 font-semibold">
                            <span className="flex items-center gap-1.5">
                              <CornerDownRight className="w-4 h-4 text-pink-400" />
                              <span>Replying as Anubama M (Author)</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingCommentId(null);
                                setReplyText('');
                              }}
                              className="text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your official response to this endorsement..."
                            className="w-full px-3.5 py-2 rounded-xl bg-[#0b0813] border border-pink-500/25 text-white text-sm outline-none focus:border-pink-400 resize-none"
                            autoFocus
                          />

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingCommentId(null);
                                setReplyText('');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-pink-950/40 text-pink-300 text-xs hover:bg-pink-900/40"
                            >
                              Discard
                            </button>
                            <button
                              type="button"
                              disabled={isSubmittingReply || !replyText.trim()}
                              onClick={() => handleSendReply(c.id)}
                              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-pink-500/20 flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{isSubmittingReply ? 'Sending...' : 'Post Reply'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingCommentId(c.id);
                            setReplyText('');
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-semibold px-3 py-1.5 rounded-lg bg-pink-950/40 border border-pink-500/25 hover:bg-pink-900/40 transition-colors"
                        >
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>Reply to Comment</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE PICTURE & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              <h1 className="text-2xl font-bold text-white tracking-tight">Profile &amp; Settings</h1>

              {/* PROFILE PICTURE MANAGEMENT SECTION */}
              <div className="p-6 rounded-2xl bg-[#130e1d]/90 border border-pink-500/25 space-y-5">
                <div className="flex items-center gap-2 border-b border-pink-500/15 pb-3">
                  <User className="w-5 h-5 text-pink-400" />
                  <h3 className="text-base font-bold text-pink-200 uppercase tracking-wider">
                    Developer Profile Picture &amp; Portrait
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300">
                  Manage Anubama's profile portrait displayed in the public Hero, About, and navigation sections.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-2">
                  {/* Avatar Preview Box */}
                  <div className="sm:col-span-4 flex flex-col items-center">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-[#0a0711] border-2 border-pink-500/40 p-1.5 shadow-2xl shadow-pink-950/60 flex items-center justify-center relative group overflow-hidden">
                      {pendingProfileImage ? (
                        <>
                          <img
                            src={pendingProfileImage}
                            alt="Profile Preview"
                            className="w-full h-full object-cover rounded-2xl ring-2 ring-yellow-400/50"
                          />
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-yellow-500/90 text-black text-[10px] font-bold shadow-md">
                            Preview
                          </div>
                        </>
                      ) : profileImage ? (
                        <>
                          <img
                            src={profileImage}
                            alt="Anubama Profile"
                            className="w-full h-full object-cover rounded-2xl"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                            <span className="text-xs text-pink-200 font-medium">Active Profile</span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#2a133d] to-[#160b24] flex flex-col items-center justify-center text-pink-300/80 gap-1.5">
                          <User className="w-10 h-10 text-pink-400/60" />
                          <span className="text-[11px] font-mono">Sakura Avatar</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 mt-2 font-mono text-center">
                      {pendingProfileImage ? (
                        <span className="text-yellow-400 font-medium">⚠️ Unsaved Preview</span>
                      ) : profileImage ? (
                        <span className="text-emerald-400">✓ Custom Picture Active</span>
                      ) : (
                        'Default Avatar Active'
                      )}
                    </span>
                  </div>

                  {/* Profile Actions */}
                  <div className="sm:col-span-8 space-y-3.5">
                    <input
                      type="file"
                      ref={profileInputRef}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />

                    {/* Pending Image Save / Cancel Buttons */}
                    {pendingProfileImage ? (
                      <div className="p-4 rounded-xl bg-yellow-950/30 border border-yellow-500/40 space-y-3">
                        <div className="text-xs font-semibold text-yellow-300">
                          New profile picture selected. Click "Save Profile Picture" to publish across your portfolio.
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={handleSaveProfileImage}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/50 transition-all active:scale-95"
                          >
                            <Check className="w-4 h-4" />
                            <span>Save Profile Picture</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelProfileImage}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs sm:text-sm font-medium transition-colors"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          disabled={isUploadingProfile}
                          onClick={() => profileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isUploadingProfile ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              <span>{profileImage ? 'Choose New Picture' : 'Choose Profile Picture'}</span>
                            </>
                          )}
                        </button>

                        {profileImage && (
                          <button
                            type="button"
                            onClick={handleRemoveProfileImage}
                            className="px-4 py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs sm:text-sm font-medium transition-colors"
                          >
                            Remove Picture
                          </button>
                        )}
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-[#0d0916] border border-pink-500/10 text-xs text-slate-300 space-y-1">
                      <div className="font-semibold text-pink-200">Supported Formats:</div>
                      <div>JPG, JPEG, PNG, WEBP, GIF (Max 5 MB file size)</div>
                      <div className="text-[11px] text-pink-300/70 font-mono mt-1">
                        Instantly synchronizes across Hero, About, and Navbar upon saving.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECURITY / CHANGE PASSWORD SECTION */}
              <div className="p-6 rounded-2xl bg-[#130e1d]/90 border border-pink-500/25 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-500/15 pb-3">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-pink-400" />
                    <h3 className="text-base font-bold text-pink-200 uppercase tracking-wider">
                      Security
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-pink-300/70 px-2.5 py-0.5 rounded-full bg-pink-950/50 border border-pink-500/20 w-fit">
                    Admin Credential Management
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300">
                  Change your admin password.
                </p>

                {passwordSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center gap-2.5 text-xs sm:text-sm text-emerald-200 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 flex items-center gap-2.5 text-xs sm:text-sm text-red-200 animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1.5">
                      Current Password <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password or initial setup key"
                        required
                        className="w-full px-4 py-2.5 pr-11 rounded-xl bg-[#0a0711] border border-pink-500/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-slate-500 text-xs sm:text-sm outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-300 transition-colors p-1"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider">
                        New Password <span className="text-pink-400">*</span>
                      </label>
                      {newPassword.length > 0 && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          newPassword.length >= 8 ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-500/30' : 'text-yellow-300 bg-yellow-950/60 border border-yellow-500/30'
                        }`}>
                          {newPassword.length >= 8 ? '✓ Min 8 Characters' : `${newPassword.length}/8 chars`}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 8 characters)"
                        required
                        minLength={8}
                        className="w-full px-4 py-2.5 pr-11 rounded-xl bg-[#0a0711] border border-pink-500/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-slate-500 text-xs sm:text-sm outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-300 transition-colors p-1"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1.5">
                      Confirm New Password <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        className="w-full px-4 py-2.5 pr-11 rounded-xl bg-[#0a0711] border border-pink-500/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 text-white placeholder-slate-500 text-xs sm:text-sm outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-300 transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingPassword}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-500/25 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSubmittingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Changing Password...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Change Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Add/Edit Modal */}
      <AdminProjectForm
        project={editingProject}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProject}
      />

      {/* Delete Project Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#140e1f] border border-red-500/40 rounded-2xl shadow-2xl shadow-red-950/50 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Project?</h3>
                <p className="text-xs text-slate-400">This action will remove it from your portfolio showcase</p>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete <span className="text-pink-300 font-semibold">"{projectToDelete.title}"</span>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl bg-pink-950/40 text-pink-200 border border-pink-500/20 text-xs font-medium hover:bg-pink-900/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProject}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-950/50 flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Message Confirmation Modal */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#140e1f] border border-red-500/40 rounded-2xl shadow-2xl shadow-red-950/50 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Inquiry Message?</h3>
                <p className="text-xs text-slate-400">This action will remove this contact inquiry permanently</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                className="px-4 py-2 rounded-xl bg-pink-950/40 text-pink-200 border border-pink-500/20 text-xs font-medium hover:bg-pink-900/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteMessage}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-950/50 flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Comment Confirmation Modal */}
      {commentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#140e1f] border border-red-500/40 rounded-2xl shadow-2xl shadow-red-950/50 p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Comment &amp; Replies?</h3>
                <p className="text-xs text-slate-400">This action will permanently delete this comment and its author replies</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCommentToDelete(null)}
                className="px-4 py-2 rounded-xl bg-pink-950/40 text-pink-200 border border-pink-500/20 text-xs font-medium hover:bg-pink-900/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteComment}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-950/50 flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
