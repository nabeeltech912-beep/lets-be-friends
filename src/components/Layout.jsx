import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Home, User, Compass, LogOut, Heart, Moon, Sun, Menu, X } from 'lucide-react';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/';
  
  const isChatPage = location.pathname === '/chat';
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Premium Navbar */}
      {!isAuthPage && (
        <nav className="sticky top-0 z-[100] bg-background/50 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-4 md:px-6">
            <Link to="/dashboard" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
              <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-br from-[#f472b6] to-[#9333ea] shadow-lg shadow-[#f472b6]/20">
                <Heart size={20} color="white" fill="white" />
              </div>
              <span className="text-xl font-normal text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Let's Be Friends
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex bg-foreground/5 p-1.5 rounded-2xl border border-foreground/10">
                <Link to="/dashboard" title="Home" className={`p-3 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-[#f472b6] text-white shadow-lg shadow-[#f472b6]/30' : 'text-muted-foreground hover:text-foreground'}`}>
                  <Home size={20} />
                </Link>
                <Link to="/chat" title="AI Chat" className={`p-3 rounded-xl transition-all ${location.pathname === '/chat' ? 'bg-[#f472b6] text-white shadow-lg shadow-[#f472b6]/30' : 'text-muted-foreground hover:text-foreground'}`}>
                  <MessageCircle size={20} />
                </Link>
                <Link to="/profile" title="Profile" className={`p-3 rounded-xl transition-all ${location.pathname === '/profile' ? 'bg-[#f472b6] text-white shadow-lg shadow-[#f472b6]/30' : 'text-muted-foreground hover:text-foreground'}`}>
                  <User size={20} />
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-foreground/10 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all border border-foreground/10">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-3 md:hidden">
              <button onClick={toggleTheme} className="p-2 rounded-lg border border-foreground/10 text-muted-foreground hover:text-foreground transition-all">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg border border-foreground/10 text-foreground transition-all">
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-foreground/10 p-4 flex flex-col gap-4 shadow-lg animate-fade-rise z-50">
              <div className="flex justify-between gap-2">
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`flex-1 flex justify-center p-3 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-[#f472b6] text-white' : 'bg-foreground/5 text-foreground'}`}>
                  <Home size={20} />
                </Link>
                <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className={`flex-1 flex justify-center p-3 rounded-xl transition-all ${location.pathname === '/chat' ? 'bg-[#f472b6] text-white' : 'bg-foreground/5 text-foreground'}`}>
                  <MessageCircle size={20} />
                </Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`flex-1 flex justify-center p-3 rounded-xl transition-all ${location.pathname === '/profile' ? 'bg-[#f472b6] text-white' : 'bg-foreground/5 text-foreground'}`}>
                  <User size={20} />
                </Link>
              </div>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </nav>
      )}

      {/* Main Content Area */}
      <main className={`${isAuthPage ? '' : 'pt-6'}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
