import { useState, useEffect } from 'react';
import { Camera, MapPin, Edit3, Heart, LogOut, ShieldCheck, Mail, Calendar, User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  if (!currentUser) return <div className="h-screen w-full bg-background flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-background font-body text-foreground pb-20">
      
      {/* Cover Header */}
      <div className="w-full h-64 bg-gradient-to-r from-[#f472b6]/20 to-[#1a1b1e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Profile Card */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="liquid-glass rounded-[40px] p-8 text-center border border-foreground/5 shadow-2xl">
              <div className="relative mx-auto mb-6 w-fit group">
                <img 
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser._id}`} 
                  alt="Profile" 
                  className="h-40 w-40 rounded-[32px] border-4 border-background object-cover ring-4 ring-[#f472b6]/10 shadow-2xl transition-transform group-hover:scale-105" 
                />
                <button className="absolute -bottom-2 -right-2 h-12 w-12 rounded-2xl bg-[#f472b6] text-white flex items-center justify-center border-4 border-background shadow-lg hover:scale-110 transition-all">
                  <Camera size={20} />
                </button>
              </div>
              
              <h1 className="text-3xl font-display text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {currentUser.name}
              </h1>
              <p className="text-[#f472b6] text-xs font-bold uppercase tracking-widest mb-6">Active Member</p>
              
              <div className="flex flex-col gap-3">
                <button className="w-full py-4 rounded-2xl bg-[#f472b6] text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#f472b6]/20 hover:opacity-90 transition-all">
                  <Edit3 size={18} /> Edit Profile
                </button>
                <button 
                  onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}
                  className="w-full py-4 rounded-2xl bg-foreground/5 text-red-400 border border-red-400/10 font-bold flex items-center justify-center gap-3 hover:bg-red-400/10 transition-all"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>

            <div className="liquid-glass rounded-[32px] p-6 border border-[#f472b6]/10">
               <div className="flex items-center gap-3 text-[#f472b6] mb-3">
                 <ShieldCheck size={18} />
                 <span className="text-xs font-bold uppercase tracking-widest">Digital Identity Verified</span>
               </div>
               <p className="text-[11px] text-muted-foreground leading-relaxed">
                 Your profile is secured and only visible to the people you connect with. We value your privacy.
               </p>
            </div>
          </div>

          {/* Details Content */}
          <div className="flex-1 w-full space-y-6">
            
            {/* About Section */}
            <div className="liquid-glass rounded-[40px] p-10 border border-foreground/5">
              <h2 className="text-2xl font-display text-foreground mb-8 flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                <User size={24} className="text-[#f472b6]" /> About Me
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Display Name</p>
                  <p className="text-foreground text-lg font-medium">{currentUser.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Email Address</p>
                  <p className="text-foreground text-lg font-medium">{currentUser.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Age</p>
                  <p className="text-foreground text-lg font-medium">{currentUser.age || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Location</p>
                  <p className="text-foreground text-lg font-medium flex items-center gap-2"><MapPin size={16} className="text-[#f472b6]" /> Global Citizen</p>
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="liquid-glass rounded-[40px] p-10 border border-foreground/5">
              <h2 className="text-2xl font-display text-foreground mb-8 flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                <Heart size={24} className="text-[#f472b6]" /> My Interests
              </h2>
              <div className="flex flex-wrap gap-4">
                {(currentUser.interests || ['Connecting', 'Socializing']).map((interest, idx) => (
                  <div key={idx} className="px-6 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground font-medium hover:border-[#f472b6]/50 hover:bg-[#f472b6]/5 transition-all cursor-default">
                    {interest}
                  </div>
                ))}
                <button className="px-6 py-3 rounded-2xl border-2 border-dashed border-foreground/10 text-muted-foreground hover:border-[#f472b6]/30 hover:text-foreground transition-all">
                  + Add More
                </button>
              </div>
            </div>

            {/* Current Vibe Section */}
            <div className="liquid-glass rounded-[40px] p-10 border border-foreground/5 bg-gradient-to-br from-[#f472b6]/5 to-transparent">
              <h2 className="text-2xl font-display text-foreground mb-8 flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                <Sparkles size={24} className="text-[#f472b6]" /> Current Vibe
              </h2>
              <div className="flex items-center gap-6">
                <div className="h-20 w-w-20 rounded-[24px] bg-[#f472b6] text-white flex items-center justify-center text-4xl shadow-lg shadow-[#f472b6]/20 px-8">
                  {currentUser.mood === 'Happy' ? '😊' : currentUser.mood === 'Chill' ? '🌊' : '✨'}
                </div>
                <div>
                  <p className="text-[#f472b6] font-bold text-xl">{currentUser.mood || 'Vibing'}</p>
                  <p className="text-muted-foreground text-sm italic">"Sharing my energy with the world!"</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
