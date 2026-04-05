import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ShieldCheck, Heart, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    // Fetch existing chat history from backend
    axios.get(`http://localhost:5000/api/chat/history/${user._id}`)
      .then(res => {
        if (res.data && res.data.messages && res.data.messages.length > 0) {
          const formattedMessages = res.data.messages.map((m, idx) => ({
            id: idx,
            text: m.content,
            sender: m.role === 'user' ? 'me' : 'them',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Approximate time
          }));
          setMessages(formattedMessages);
        } else {
          const initialGreeting = `Heyy ${user.name.split(' ')[0]} 😊 epdi iruka? saptiya?`;
          setMessages([{ id: Date.now(), text: initialGreeting, sender: 'them', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }
      })
      .catch(err => {
        console.error("Error fetching history:", err);
        const initialGreeting = `Heyy ${user.name.split(' ')[0]} 😊 epdi iruka? saptiya?`;
        setMessages([{ id: Date.now(), text: initialGreeting, sender: 'them', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      });
  }, [navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    
    const userMsg = newMessage;
    setNewMessage('');
    
    const newMsgObj = {
      id: Date.now(),
      text: userMsg,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMsgObj]);
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat/ai', {
        userId: currentUser._id,
        message: userMsg,
        userName: currentUser.name
      });
      
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: res.data.response,
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Ayyio.. chinna issue (Network Error). Epdi iruka? 😊",
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  if (!currentUser) return <div className="h-screen w-full bg-background flex items-center justify-center text-foreground">Loading...</div>;

  return (
    <div className="h-[calc(100vh-80px)] w-full bg-background font-body text-foreground overflow-hidden">
      
      <div className="max-w-7xl mx-auto h-full px-6 py-6 flex gap-6">
        
        {/* Left Sidebar: Personality & Info */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 space-y-6">
          <div className="liquid-glass rounded-[32px] p-8 text-center border border-foreground/5 shadow-2xl shadow-[#f472b6]/5">
            <div className="relative mx-auto mb-6 w-fit">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" 
                alt="AI Companion" 
                className="h-24 w-24 rounded-3xl border-4 border-background object-cover ring-2 ring-[#f472b6]/20" 
              />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-4 border-[#1a1b1e]"></div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">Sweet Friend</h3>
            <p className="text-[#f472b6] text-sm font-bold uppercase tracking-widest mb-6">Online & Typing...</p>
            
            <div className="text-left space-y-4">
               <div className="p-4 rounded-2xl bg-foreground/5 border border-foreground/10">
                 <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Current Mode</p>
                 <p className="text-foreground text-sm">Girl Bestie (Thanglish) ✨</p>
               </div>
            </div>
          </div>

          <div className="liquid-glass rounded-[32px] p-6 border border-[#f472b6]/10">
             <div className="flex items-center gap-3 text-[#f472b6] mb-3">
               <ShieldCheck size={18} />
               <span className="text-xs font-bold uppercase tracking-widest">End-to-End Private</span>
             </div>
             <p className="text-[11px] text-muted-foreground leading-relaxed">
               Your thoughts are your own. We never store or share your personal chat history. Safe, secure, and judgment-free.
             </p>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 liquid-glass rounded-[40px] flex flex-col border border-foreground/5 overflow-hidden shadow-2xl">
          
          {/* Chat Header */}
          <header className="px-4 md:px-8 py-4 md:py-5 flex items-center justify-between border-b border-foreground/5 bg-foreground/[0.02]">
            <div className="flex items-center gap-4">
              <div className="lg:hidden h-10 w-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-foreground font-medium">Chat with Sweetie</h4>
                <p className="text-[10px] text-[#f472b6] font-bold uppercase tracking-widest">Always here for you ❤️</p>
              </div>
            </div>
            <button onClick={() => setMessages([])} className="h-10 w-10 flex items-center justify-center rounded-xl bg-foreground/5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all">
              <Trash2 size={18} />
            </button>
          </header>

          {/* Messages Window */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-10 space-y-6 md:space-y-8 scroll-smooth custom-scrollbar">
            {messages.map((msg, idx) => {
              const isMe = msg.sender === 'me';
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-rise`}>
                  <div className={`flex gap-4 max-w-[85%] sm:max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="h-10 w-10 shrink-0 rounded-2xl overflow-hidden self-end mb-1 border-2 border-foreground/10 shadow-lg">
                      {isMe ? (
                        <img src={currentUser.avatar} alt="Me" className="h-full w-full object-cover" />
                      ) : (
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="AI" className="h-full w-full object-cover bg-[#f472b6]/20" />
                      )}
                    </div>
                    <div className={`space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`px-6 py-4 rounded-[24px] ${
                        isMe 
                        ? 'bg-[#f472b6] text-white rounded-br-none shadow-lg shadow-[#f472b6]/20' 
                        : 'bg-foreground/5 text-muted-foreground border border-foreground/10 rounded-bl-none shadow-xl'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-1">{msg.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-rise">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-2xl overflow-hidden self-end mb-1 border-2 border-foreground/10 bg-[#f472b6]/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-[#f472b6] animate-pulse" />
                  </div>
                  <div className="px-6 py-4 rounded-[24px] rounded-bl-none bg-foreground/5 border border-foreground/10 flex gap-1.5 items-center h-12">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#f472b6]/40 animate-bounce"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-[#f472b6]/60 animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-[#f472b6] animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <footer className="p-4 md:p-8 bg-foreground/[0.02] border-t border-foreground/5">
            <form onSubmit={handleSend} className="relative flex items-center bg-foreground/5 rounded-[24px] border border-foreground/10 p-2 shadow-2xl focus-within:border-[#f472b6]/50 transition-all">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Epdi iruka? saptiya?" 
                className="flex-1 bg-transparent border-none outline-none text-foreground px-6 py-3 text-sm placeholder:text-muted-foreground/30"
                disabled={isTyping}
              />
              <button 
                type="submit" 
                disabled={isTyping || !newMessage.trim()} 
                className="h-12 w-12 rounded-2xl bg-[#f472b6] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-[#f472b6]/20 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={20} />
              </button>
            </form>
          </footer>

        </main>
      </div>
    </div>
  );
}

export default Chat;
