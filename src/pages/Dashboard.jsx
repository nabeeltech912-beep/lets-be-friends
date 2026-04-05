import { useState, useEffect } from 'react';
import { Search, Users, UserPlus, Heart, Sparkles, X, MessageCircle, Settings, LogOut, Sun, Moon, Home, Compass, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [randomUser, setRandomUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    // Fetch suggestions initially
    axios.get(`/api/users/search?q=a`) 
      .then(res => setSuggestedUsers(res.data.slice(0, 4)))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await axios.get(`/api/users/search?q=${searchQuery}&currentUserId=${currentUser?._id}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMeetSomeoneNew = async () => {
    try {
      const res = await axios.get(`/api/users/random?currentUserId=${currentUser?._id}`);
      setRandomUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) return <div className="h-screen w-full bg-background flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-background font-body text-foreground pb-20">
      
      {/* Premium Dashboard Container */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Welcome back, <span className="text-[#f472b6]">{currentUser.name.split(' ')[0]}</span>.
            </h1>
            <p className="text-muted-foreground">The world is waiting for your next connection.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/chat" className="liquid-glass group rounded-full px-6 py-3 text-sm font-semibold text-white bg-[#f472b6] transition-all hover:scale-[1.05] flex items-center gap-2">
              <Sparkles size={18} className="animate-pulse" />
              Chat with AI
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar / Profile Card */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="liquid-glass rounded-[32px] p-8 text-center border border-foreground/5">
              <div className="relative mx-auto mb-6 w-fit">
                <img 
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`} 
                  alt="My Profile" 
                  className="h-24 w-24 rounded-full border-4 border-background object-cover ring-2 ring-[#f472b6]/20" 
                />
                <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-4 border-background"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{currentUser.name}</h3>
              <p className="text-[#f472b6] text-sm font-bold mb-4 uppercase tracking-widest">{currentUser.mood || 'Happy'}</p>
              
              <div className="space-y-2 mb-8">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Interests</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentUser.interests?.slice(0, 3).map(i => (
                    <span key={i} className="px-3 py-1 rounded-full bg-foreground/5 text-[10px] text-muted-foreground border border-foreground/10">{i}</span>
                  ))}
                </div>
              </div>

              <Link to="/profile" className="block w-full py-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 text-sm font-semibold transition-colors">
                Edit Profile
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="liquid-glass rounded-[32px] p-6 border border-foreground/5">
               <h4 className="text-foreground text-sm font-bold mb-4 px-2">Quick Actions</h4>
               <nav className="space-y-1">
                 <button onClick={handleMeetSomeoneNew} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f472b6]/10 text-muted-foreground hover:text-[#f472b6] transition-all text-sm group">
                   <Users size={18} className="group-hover:scale-110 transition-transform" />
                   Meet Random Friend
                 </button>
                 <Link to="/chat" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f472b6]/10 text-muted-foreground hover:text-[#f472b6] transition-all text-sm group">
                   <Sparkles size={18} className="group-hover:scale-110 transition-transform" />
                   New AI Session
                 </Link>
               </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-8">
            
            {/* Search Section */}
            <div className="relative">
              <form onSubmit={handleSearch} className="relative z-10">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find your tribe... search by name or interests" 
                  className="w-full rounded-full bg-foreground/5 border border-foreground/10 px-16 py-5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#f472b6]/50 transition-all shadow-xl"
                />
              </form>
            </div>

            {/* Discover Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl text-foreground font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  {searchResults ? `Results for "${searchQuery}"` : '✨ Suggested Connections'}
                </h2>
                {!searchResults && <p className="text-xs font-bold text-[#f472b6] uppercase tracking-widest">See All</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(searchResults || suggestedUsers).map((user) => (
                  <div key={user._id} className="liquid-glass group rounded-[32px] p-6 flex items-center justify-between border border-foreground/5 hover:border-[#f472b6]/20 transition-all hover:bg-foreground/[0.02]">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-foreground/5" />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#f472b6] border-2 border-[#1a2b3c] flex items-center justify-center">
                           <Heart size={8} color="white" fill="white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-foreground font-semibold text-lg">{user.name}</h4>
                        <p className="text-muted-foreground text-xs line-clamp-1 max-w-[150px]">
                          {user.interests?.join(' • ') || 'Discovering new things'}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-[#f472b6]/10 text-[9px] text-[#f472b6] font-bold border border-[#f472b6]/20 uppercase">
                            {user.mood || 'Vibing'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="h-12 w-12 rounded-2xl bg-foreground/5 hover:bg-[#f472b6] text-muted-foreground hover:text-foreground transition-all flex items-center justify-center group-hover:scale-105">
                      <UserPlus size={20} />
                    </button>
                  </div>
                ))}
              </div>
              
              {searchResults && searchResults.length === 0 && (
                <div className="text-center py-20 bg-foreground/5 rounded-[32px] border border-dashed border-foreground/10">
                  <p className="text-muted-foreground">No one matches that exact vibe... try searching for something else! ✨</p>
                </div>
              )}
            </div>

            {/* AI Companion Preview Card */}
            <div className="liquid-glass relative overflow-hidden rounded-[40px] p-10 border border-[#f472b6]/10 group">
              <div className="relative z-10 md:w-2/3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 rounded-full bg-foreground/10 text-[10px] text-foreground font-bold uppercase tracking-widest">Recommended</div>
                </div>
                <h2 className="text-4xl text-foreground mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Need to talk? <br />
                  Our <span className="text-[#f472b6]">AI Companion</span> is always here.
                </h2>
                <p className="text-muted-foreground mb-8 line-relaxed">
                  Deep conversations, empathetic ears, and zero judgment. Experience a connection that's always ready to listen.
                </p>
                <Link to="/chat" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-[1.03] transition-transform">
                  <MessageCircle size={20} /> Start Deep Conversation
                </Link>
              </div>
              
              {/* Decorative AI Graphics */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#f472b6] rounded-full blur-[100px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"></div>
              <Sparkles className="absolute top-10 right-10 text-[#f472b6] opacity-30 animate-pulse" size={60} />
            </div>

          </main>
        </div>
      </div>

      {/* Random User Modal */}
      {randomUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-20 overflow-y-auto">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl transition-all" onClick={() => setRandomUser(null)}></div>
          <div className="liquid-glass relative w-full max-w-lg rounded-[40px] p-8 sm:p-12 text-center border border-[#f472b6]/20 animate-fade-rise">
            <button onClick={() => setRandomUser(null)} className="absolute top-6 right-6 h-12 w-12 rounded-2xl bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center text-foreground transition-colors">
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <div className="px-4 py-1 w-fit mx-auto rounded-full bg-[#f472b6]/10 text-[#f472b6] text-xs font-bold uppercase tracking-widest mb-6 border border-[#f472b6]/20">New Discovery</div>
              <div className="relative mx-auto mb-8 w-fit">
                <img src={randomUser.avatar} alt={randomUser.name} className="h-32 w-32 sm:h-40 sm:w-40 rounded-[32px] object-cover ring-4 ring-[#f472b6]/30 shadow-[0_0_50px_rgba(244,114,182,0.3)]" />
                <Sparkles className="absolute -top-4 -right-4 text-[#f472b6]" size={40} />
              </div>
              <h3 className="text-4xl text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>{randomUser.name}, {randomUser.age || '?'}</h3>
              <p className="text-[#f472b6] font-bold text-sm tracking-[0.2em] uppercase mb-6">{randomUser.mood}</p>
              <p className="text-muted-foreground leading-relaxed">
                Connect and share your interests in <span className="text-foreground">{randomUser.interests?.join(', ') || 'Various things'}</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleMeetSomeoneNew}
                className="py-4 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground font-semibold hover:bg-foreground/10 transition-all"
              >
                Find Another
              </button>
              <button className="py-4 rounded-2xl bg-[#f472b6] text-white font-bold hover:scale-[1.03] transition-transform shadow-lg shadow-[#f472b6]/20 flex items-center justify-center gap-2">
                <Heart size={20} fill="white" /> Say Hello
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
