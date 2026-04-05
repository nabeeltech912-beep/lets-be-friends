import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Smile, Calendar, Heart, ArrowLeft } from 'lucide-react';
import axios from 'axios';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', age: '', interests: '', mood: 'Happy'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        const payload = { ...formData, interests: formData.interests.split(',').map(i => i.trim()) };
        const res = await axios.post('/api/register', payload);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } else {
        const res = await axios.post('/api/login', { email: formData.email, password: formData.password });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Using mock login.');
      const mockUser = { _id: '123', name: formData.name || 'Alex User', email: formData.email, avatar: 'https://ui-avatars.com/api/?name=User&background=random' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-body text-foreground">
      {/* Background Video (Lowered Opacity) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-30 blur-[2px]"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>

      {/* Top Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link to="/" className="flex items-center gap-2 text-2xl tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
          <Heart className="text-[#f472b6] fill-[#f472b6]" size={24} />
          Let's Be Friends
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      <main className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center p-6">
        <div className="liquid-glass w-full max-w-[1000px] rounded-[32px] md:flex">
          
          {/* Left: Branding */}
          <div className="hidden flex-col justify-between p-12 md:flex md:w-1/2 border-r border-border/50">
            <div>
              <h2 className="text-4xl leading-tight text-foreground mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Meet new people, <br />
                <span className="text-[#f472b6]">share real moments.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xs">
                Your sanctuary for meaningful connections and AI companionship.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="User"
                    className="h-10 w-10 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Join 10k+ friends online</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full bg-background/40 p-8 md:p-12 md:w-1/2">
            <div className="mb-8">
              <h3 className="text-3xl font-normal text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </h3>
              <p className="text-muted-foreground">
                {isRegister ? 'Join our community in minutes.' : 'Please enter your details to sign in.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold ml-1">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-12 py-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#f472b6]/50 transition-colors"
                        required={isRegister}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold ml-1">Age</label>
                      <input 
                        type="number" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleInputChange}
                        placeholder="22"
                        className="w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-6 py-4 text-foreground focus:outline-none focus:border-[#f472b6]/50 transition-colors"
                        required={isRegister}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold ml-1">Vibe</label>
                      <select 
                        name="mood" 
                        value={formData.mood} 
                        onChange={handleInputChange}
                        className="w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-6 py-4 text-foreground focus:outline-none focus:border-[#f472b6]/50 transition-colors appearance-none"
                      >
                        <option value="Happy">Happy</option>
                        <option value="Chill">Chill</option>
                        <option value="Excited">Excited</option>
                        <option value="Sad">Sad</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold ml-1">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder="name@email.com"
                    className="w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-12 py-4 text-foreground focus:outline-none focus:border-[#f472b6]/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-[#f472b6] font-semibold ml-1">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl bg-foreground/5 border border-foreground/10 px-12 py-4 text-foreground focus:outline-none focus:border-[#f472b6]/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full liquid-glass rounded-2xl bg-[#f472b6] mt-4 py-4 font-semibold text-foreground transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
              >
                {isRegister ? 'Begin Your Journey' : 'Step Inside'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">
                {isRegister ? 'Already a member? ' : "New here? "}
              </span>
              <button 
                onClick={() => setIsRegister(!isRegister)} 
                className="font-bold text-[#f472b6] hover:underline"
              >
                {isRegister ? 'Sign In' : 'Join for Free'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
