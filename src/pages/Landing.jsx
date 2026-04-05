import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-body">
      {/* Cinematic Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link to="/" className="flex items-center gap-2 text-3xl tracking-tight text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
          <Heart className="text-[#f472b6] fill-[#f472b6]" size={32} />
          Let's Be Friends
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/login" className="px-6 py-2 text-sm font-medium text-foreground transition-colors hover:text-[#f472b6]">
            Log in
          </Link>
          <Link to="/login" className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white bg-[#f472b6]/20 transition-transform hover:scale-[1.03]">
            Join Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-40 text-center md:py-[120px]">
        <div className="max-w-7xl">
          <h1 
            className="animate-fade-rise text-6xl font-normal leading-[0.95] tracking-[-2.46px] text-foreground sm:text-8xl md:text-9xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Strangers <br />
            to <em className="not-italic text-[#f472b6]">Friends.</em>
          </h1>

          <p className="animate-fade-rise-delay mx-auto mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The easiest way to connect with like-minded people, discover 
            new interests, and talk to an AI companion when you feel lonely.
          </p>

          <div className="animate-fade-rise-delay-2 mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <Link 
              to="/login" 
              className="liquid-glass cursor-pointer rounded-full bg-[#f472b6] px-14 py-5 text-base font-semibold text-foreground transition-all hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(244,114,182,0.4)]"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </main>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-1"></div>
    </div>
  );
};

export default Landing;
