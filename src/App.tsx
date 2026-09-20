import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { EducationCertifications } from './components/EducationCertifications';
import { Comments } from './components/Comments';
import { SoftSkills } from './components/SoftSkills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { Toast } from './components/Toast';
import { SakuraCanvas } from './components/SakuraCanvas';
import { LoadingScreen } from './components/LoadingScreen';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { authService, UserSession } from './services/authService';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [session, setSession] = useState<UserSession | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSakuraEnabled, setIsSakuraEnabled] = useState(true);

  // Check URL hash for direct #admin route
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname.endsWith('/admin')) {
        setCurrentView('admin');
      } else if (currentView === 'admin' && !window.location.hash.includes('admin')) {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  // Check initial admin session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const existingSession = await authService.getSession();
        setSession(existingSession);
      } catch (err) {
        console.error('Error verifying admin session:', err);
      }
    };
    initAuth();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    showToast('🌸 Welcome to the Admin Console');
  };

  const handleLogout = async () => {
    await authService.logout();
    setSession(null);
    showToast('Logged out of Admin Console');
    setCurrentView('home');
    window.location.hash = '';
  };

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
  };

  return (
    <div className="relative min-h-screen bg-[#0a0711] text-slate-100 flex flex-col font-sans selection:bg-pink-500/30 selection:text-pink-200">
      {/* Initial Sakura Loading Experience */}
      <LoadingScreen />

      {/* High Performance Sakura Falling Blossoms Dynamic Particle Canvas */}
      <SakuraCanvas enabled={isSakuraEnabled} intensity="normal" />

      {currentView === 'admin' ? (
        // Admin View (Protected)
        session?.isAdmin ? (
          <AdminDashboard
            session={session}
            onLogout={handleLogout}
            onNavigateHome={navigateToHome}
            onShowToast={showToast}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onCancel={navigateToHome}
          />
        )
      ) : (
        // Public Sakura Developer Portfolio View
        <>
          {/* Top Fixed Header Navbar */}
          <Navbar
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
            onNavigateAdmin={navigateToAdmin}
            isSakuraEnabled={isSakuraEnabled}
            onToggleSakura={() => {
              setIsSakuraEnabled(!isSakuraEnabled);
              showToast(isSakuraEnabled ? '🌸 Falling petals paused' : '🌸 Falling petals active');
            }}
          />

          {/* Main Content Sections */}
          <main className="flex-grow">
            <Hero onOpenResumeModal={() => setIsResumeModalOpen(true)} />
            <About />
            <Skills />
            <Projects />
            <EducationCertifications />
            <Comments onShowToast={showToast} />
            <SoftSkills />
            <Contact onShowToast={showToast} />
          </main>

          {/* Global Footer */}
          <Footer onNavigateAdmin={navigateToAdmin} />

          {/* Resume Download & Details Modal */}
          <ResumeModal
            isOpen={isResumeModalOpen}
            onClose={() => setIsResumeModalOpen(false)}
            onShowToast={showToast}
          />
        </>
      )}

      {/* Global Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

export default App;
