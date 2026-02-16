import { useState, useEffect, useCallback } from "react";
import { supabase } from './supabaseClient';
import './App.css';

// ============================================================
// MY STAR — Premium Reputation Management Platform
// ============================================================

const DEMO_REVIEWS = [
  { id:1, author_name:"Sarah Mitchell", rating:5, review_text:"Tom and his crew replaced our entire HVAC system in one day. Professional, clean, and the price was exactly what they quoted. Can't recommend enough!", review_date:"Feb 12, 2026", platform:"Google", ai_response_status:"posted", ai_response:"Thank you so much, Sarah! We take pride in getting the job done right and on time. It was a pleasure working with you — enjoy that new system!" },
  { id:2, author_name:"Mike Rodriguez", rating:5, review_text:"Called at 8am with a busted pipe, they were here by 9:30. Fixed it fast and didn't try to upsell me on anything. Honest guys.", review_date:"Feb 10, 2026", platform:"Google", ai_response_status:"posted", ai_response:"Mike, we appreciate you trusting us with the emergency. That's what we're here for — fast, honest service. Thanks for the kind words!" },
  { id:3, author_name:"Jennifer Liu", rating:4, review_text:"Good work on the roof repair. Only reason it's not 5 stars is the crew was about 30 minutes late. But the quality of work was excellent.", review_date:"Feb 8, 2026", platform:"Google", ai_response_status:"posted", ai_response:"Hi Jennifer, thank you for the honest feedback. We apologize for the delay — we're working on tightening our scheduling. Glad the repair met your expectations!" },
  { id:4, author_name:"David Kowalski", rating:5, review_text:"Third time using these guys. Consistent quality every time. They maintain our commercial HVAC systems and I wouldn't trust anyone else.", review_date:"Feb 5, 2026", platform:"Google", ai_response_status:"posted", ai_response:"David, it's clients like you that make this work so rewarding. We value the ongoing trust and look forward to keeping your systems running perfectly!" },
  { id:5, author_name:"Amanda Torres", rating:5, review_text:"The technician was super knowledgeable and took the time to explain everything. Even showed me how to maintain the unit myself.", review_date:"Feb 2, 2026", platform:"Yelp", ai_response_status:"pending", ai_response:"" },
  { id:6, author_name:"Robert James", rating:2, review_text:"Had to reschedule twice. When they finally came out the work was fine but the scheduling was frustrating.", review_date:"Jan 28, 2026", platform:"Google", ai_response_status:"posted", ai_response:"Robert, we sincerely apologize for the scheduling issues. That's not the experience we want. We've addressed this internally and would love the chance to make it right." },
];
const DEMO_COMPETITORS = [
  { id:1, competitor_name:"Your Company", review_count:147, star_rating:4.7, monthly_growth:23, you:true },
  { id:2, competitor_name:"CoolAir Pros", review_count:312, star_rating:4.8, monthly_growth:11 },
  { id:3, competitor_name:"Texas Comfort HVAC", review_count:189, star_rating:4.5, monthly_growth:8 },
  { id:4, competitor_name:"Premier Heating & Air", review_count:95, star_rating:4.3, monthly_growth:5 },
  { id:5, competitor_name:"DFW Climate Control", review_count:67, star_rating:4.1, monthly_growth:3 },
];
const DEMO_MONTHS = [{m:"Sep",r:4},{m:"Oct",r:7},{m:"Nov",r:11},{m:"Dec",r:15},{m:"Jan",r:19},{m:"Feb",r:23}];

// --- Icons ---
const StarSvg=({filled,s=15})=><svg width={s} height={s} viewBox="0 0 24 24" fill={filled?"#F59E0B":"none"} stroke={filled?"#F59E0B":"#374151"} strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const StarRow=({rating,s=15})=><span style={{display:"inline-flex",gap:2,alignItems:"center"}}>{[1,2,3,4,5].map(i=><StarSvg key={i} filled={i<=rating} s={s}/>)}</span>;
const IcoCheck=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/></svg>;
const IcoTrend=()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6"/></svg>;
const IcoAlert=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoBell=()=><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IcoBar=()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>;
const IcoUsers=()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const IcoMsg=()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IcoGear=()=><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
const IcoBack=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const IcoZap=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoShield=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoTarget=()=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IcoLogout=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
const IcoLock=()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IcoArrow=()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const IcoStar=({s=16})=><svg width={s} height={s} viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

const Logo=({size=20})=>(
  <span style={{fontFamily:"'Sora',sans-serif",fontSize:size,fontWeight:800,color:'#fff',letterSpacing:'-0.5px',display:'inline-flex',alignItems:'center',userSelect:'none',gap:2}}>
    My<span style={{display:'inline-flex',alignItems:'center',margin:'0 2px',position:'relative',top:'-1px'}}>
      <svg viewBox="0 0 24 24" style={{width:size*0.85,height:size*0.85}} fill="url(#sg)" stroke="none"><defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#FBBF24"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    </span><span style={{background:'linear-gradient(135deg,#34D399,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Star</span>
  </span>
);

const LogoDark=({size=20})=>(
  <span style={{fontFamily:"'Sora',sans-serif",fontSize:size,fontWeight:800,color:'#0C0F17',letterSpacing:'-0.5px',display:'inline-flex',alignItems:'center',userSelect:'none',gap:2}}>
    My<span style={{display:'inline-flex',alignItems:'center',margin:'0 2px',position:'relative',top:'-1px'}}>
      <svg viewBox="0 0 24 24" style={{width:size*0.85,height:size*0.85}} fill="url(#sg2)" stroke="none"><defs><linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#FBBF24"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    </span><span style={{background:'linear-gradient(135deg,#34D399,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Star</span>
  </span>
);

// Input field style
const inputDark = {width:'100%',padding:'13px 18px',borderRadius:12,border:'1px solid rgba(255,255,255,.07)',background:'rgba(255,255,255,.03)',backdropFilter:'blur(8px)',color:'#fff',fontSize:14.5,fontFamily:"'DM Sans',sans-serif",outline:'none',transition:'all .3s'};
const inputLight = {width:'100%',padding:'11px 16px',borderRadius:12,border:'1px solid #E2E8F0',fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:'none',transition:'all .3s',color:'#0F172A'};

// ============================================================
// AUTH PAGE
// ============================================================
function AuthPage({ go, onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login') {
        const { data, error: e } = await supabase.auth.signInWithPassword({ email, password });
        if (e) throw e; onAuth(data.user);
      } else {
        const { data, error: e } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
        if (e) throw e;
        if (data.user) { setSuccess('Account created! You can now log in.'); setMode('login'); setPassword(''); }
      }
    } catch (err) { setError(err.message || 'Something went wrong'); }
    setLoading(false);
  };
  const kd = (e) => { if (e.key === 'Enter') handleSubmit(); };
  const focusBorder = (e) => { e.target.style.borderColor = 'rgba(52,211,153,.4)'; };
  const blurBorder = (e) => { e.target.style.borderColor = 'rgba(255,255,255,.07)'; };

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',position:'relative'}}>
      <div style={{position:'absolute',width:500,height:500,top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'radial-gradient(circle,rgba(52,211,153,.04) 0%,transparent 60%)',borderRadius:'50%',pointerEvents:'none'}}/>
      <nav className="nv"><div style={{cursor:'pointer'}} onClick={()=>go('home')}><Logo size={22}/></div><button className="b bo" onClick={()=>go('home')}><IcoBack/> Back</button></nav>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 24px 80px'}}>
        <div style={{maxWidth:400,width:'100%'}} className="au">
          <div style={{width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,rgba(52,211,153,.1),rgba(6,182,212,.1))',border:'1px solid rgba(52,211,153,.12)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 28px',color:'#34D399'}}><IcoLock/></div>
          <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:30,fontWeight:800,color:'#fff',letterSpacing:-1,marginBottom:8,textAlign:'center'}}>
            {mode === 'login' ? 'Welcome back' : 'Get started'}
          </h2>
          <p style={{color:'#94A3B8',textAlign:'center',marginBottom:32,fontSize:14,lineHeight:1.6}}>
            {mode === 'login' ? 'Sign in to your My Star dashboard' : 'Create your My Star account'}
          </p>
          {error && <div className="errmsg">{error}</div>}
          {success && <div className="succmsg">{success}</div>}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {mode === 'signup' && (
              <div><label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:1.5}}>Full Name</label>
              <input value={fullName} onChange={e=>setFullName(e.target.value)} onKeyDown={kd} placeholder="Mike Johnson" style={inputDark} onFocus={focusBorder} onBlur={blurBorder}/></div>
            )}
            <div><label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:1.5}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={kd} placeholder="you@company.com" style={inputDark} onFocus={focusBorder} onBlur={blurBorder}/></div>
            <div><label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:1.5}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={kd} placeholder="Min 6 characters" style={inputDark} onFocus={focusBorder} onBlur={blurBorder}/></div>
            <button className="b bp bl" disabled={loading} style={{width:'100%',justifyContent:'center',marginTop:8,borderRadius:12}} onClick={handleSubmit}>
              {loading ? <span className="spinner" style={{width:16,height:16}}/> : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <IcoArrow/></>}
            </button>
            <p style={{color:'#64748B',fontSize:13,textAlign:'center',marginTop:6}}>
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <span style={{color:'#34D399',cursor:'pointer',fontWeight:600}} onClick={()=>{setMode(mode==='login'?'signup':'login');setError('');setSuccess('')}}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LIVE REVIEW TICKER
// ============================================================
function LiveTicker() {
  const [count, setCount] = useState(12847);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 4000 + Math.random() * 6000);
    return () => clearInterval(interval);
  }, []);
  const digits = String(count).split('');
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,background:'rgba(255,255,255,.03)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,.06)',borderRadius:100,padding:'10px 24px',margin:'0 auto 20px'}}>
      <div style={{width:8,height:8,borderRadius:'50%',background:'#34D399',boxShadow:'0 0 12px #34D399',animation:'pulse 2s ease-in-out infinite'}}/>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'rgba(255,255,255,.5)',letterSpacing:'.3px'}}>Reviews generated:</span>
      <span style={{display:'inline-flex',gap:2}}>
        {digits.map((d,i) => (
          <span key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,background:'linear-gradient(135deg,#34D399,#06B6D4)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',minWidth:14,textAlign:'center',transition:'all .4s'}}>{d}</span>
        ))}
      </span>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'rgba(255,255,255,.3)',letterSpacing:'.3px'}}>and counting</span>
    </div>
  );
}

// ============================================================
// ROI CALCULATOR
// ============================================================
function ROICalculator({ go }) {
  const [avgJob, setAvgJob] = useState(4500);
  const [currentReviews, setCurrentReviews] = useState(45);
  const [competitorReviews, setCompetitorReviews] = useState(180);

  // Logic: Each additional review = ~1.5% more calls. Gap * 1.5% * monthly leads * avg job = lost revenue
  const gap = Math.max(0, competitorReviews - currentReviews);
  const lostCallPercent = Math.min(gap * 0.8, 65); // cap at 65%
  const estimatedMonthlyLeads = 40; // typical HVAC/plumbing
  const lostLeadsPerMonth = Math.round(estimatedMonthlyLeads * (lostCallPercent / 100));
  const lostRevenueMonthly = lostLeadsPerMonth * avgJob;
  const lostRevenueYearly = lostRevenueMonthly * 12;

  const formatMoney = (n) => '$' + n.toLocaleString();

  const sliderStyle = {width:'100%',height:6,borderRadius:3,appearance:'none',WebkitAppearance:'none',background:'rgba(255,255,255,.08)',outline:'none',cursor:'pointer'};

  return (
    <section className="sc scd" id="roi">
      <div className="sl">Revenue Impact</div>
      <h2 className="st std">How much are fewer reviews costing you?</h2>
      <p className="sd">Adjust the sliders to match your business. See the real revenue you're leaving on the table.</p>
      <div style={{maxWidth:800,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        {/* Left — Sliders */}
        <div style={{background:'rgba(255,255,255,.03)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,.06)',borderRadius:24,padding:'36px 32px'}}>
          <div style={{marginBottom:28}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#64748B',fontWeight:600,textTransform:'uppercase',letterSpacing:1.5}}>Avg Job Value</label>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:'#fff'}}>{formatMoney(avgJob)}</span>
            </div>
            <input type="range" min={500} max={25000} step={250} value={avgJob} onChange={e=>setAvgJob(Number(e.target.value))} style={sliderStyle}/>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}><span style={{fontSize:10,color:'#475569'}}>$500</span><span style={{fontSize:10,color:'#475569'}}>$25,000</span></div>
          </div>
          <div style={{marginBottom:28}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#64748B',fontWeight:600,textTransform:'uppercase',letterSpacing:1.5}}>Your Reviews</label>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:'#fff'}}>{currentReviews}</span>
            </div>
            <input type="range" min={0} max={300} step={5} value={currentReviews} onChange={e=>setCurrentReviews(Number(e.target.value))} style={sliderStyle}/>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}><span style={{fontSize:10,color:'#475569'}}>0</span><span style={{fontSize:10,color:'#475569'}}>300</span></div>
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#64748B',fontWeight:600,textTransform:'uppercase',letterSpacing:1.5}}>Top Competitor Reviews</label>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:'#fff'}}>{competitorReviews}</span>
            </div>
            <input type="range" min={0} max={500} step={5} value={competitorReviews} onChange={e=>setCompetitorReviews(Number(e.target.value))} style={sliderStyle}/>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}><span style={{fontSize:10,color:'#475569'}}>0</span><span style={{fontSize:10,color:'#475569'}}>500</span></div>
          </div>
        </div>

        {/* Right — Results */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.12)',borderRadius:20,padding:'28px 28px',flex:1,display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#F87171',fontWeight:600,textTransform:'uppercase',letterSpacing:2,marginBottom:8}}>You're Losing</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:48,fontWeight:800,color:'#FCA5A5',letterSpacing:-2,lineHeight:1}}>{formatMoney(lostRevenueYearly)}</div>
            <div style={{fontSize:14,color:'#F87171',marginTop:6}}>per year in lost revenue</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:16,padding:'20px 22px'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#64748B',fontWeight:600,textTransform:'uppercase',letterSpacing:1.5,marginBottom:6}}>Review Gap</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:'#F87171',lineHeight:1}}>{gap}</div>
              <div style={{fontSize:11,color:'#94A3B8',marginTop:2}}>reviews behind</div>
            </div>
            <div style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:16,padding:'20px 22px'}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#64748B',fontWeight:600,textTransform:'uppercase',letterSpacing:1.5,marginBottom:6}}>Lost Leads</div>
              <div style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:700,color:'#F59E0B',lineHeight:1}}>~{lostLeadsPerMonth}</div>
              <div style={{fontSize:11,color:'#94A3B8',marginTop:2}}>calls / month</div>
            </div>
          </div>
          <div style={{background:'linear-gradient(135deg,rgba(52,211,153,.08),rgba(6,182,212,.08))',border:'1px solid rgba(52,211,153,.15)',borderRadius:16,padding:'20px 22px',textAlign:'center'}}>
            <div style={{fontSize:13,color:'#94A3B8',marginBottom:6}}>My Star pays for itself if you close just</div>
            <div style={{fontFamily:"'Sora',sans-serif",fontSize:32,fontWeight:800,color:'#34D399',lineHeight:1}}>1 extra job</div>
            <div style={{fontSize:12,color:'#64748B',marginTop:4}}>per month from new reviews</div>
          </div>
          <button className="b bp bl" style={{width:'100%',justifyContent:'center',borderRadius:14}} onClick={() => go('audit')}>
            Get Your Free Audit <IcoArrow/>
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
function Landing({ go, user }) {
  return (
    <div>
      <section className="hero">
        <div className="hbg"><div className="orb1"/><div className="orb2"/><div className="orb3"/><div className="hgrid"/><div className="hline"/></div>
        <nav className="nv">
          <Logo size={22}/>
          <div className="nvl">
            <button className="nvk" onClick={() => document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>How It Works</button>
            <button className="nvk" onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Pricing</button>
            {user ? (
              <button className="b bp" onClick={() => go('dash')}>My Dashboard <IcoArrow/></button>
            ) : (
              <><button className="b bo" onClick={() => go('login')}>Sign In</button>
              <button className="b bp" onClick={() => go('audit')}>Free Audit <IcoArrow/></button></>
            )}
          </div>
        </nav>
        <div className="hc">
          <div className="hbadge au"><span className="hdot"/>Done-For-You Reputation System</div>
          <h1 className="au au1">Your competitor has 3x<br/>your reviews. <em>We fix<br/>that in 30 days.</em></h1>
          <p className="hsub au au2">We build, run, and manage your entire review generation system. More 5-star reviews, AI-powered responses, and a Google profile that dominates — without you lifting a finger.</p>
          <div className="hbtns au au3">
            <button className="b bp bl" onClick={() => go('audit')}>Get Your Free Audit <IcoArrow/></button>
            <button className="b bo bl" onClick={() => go(user ? 'dash' : 'login')}>{user ? 'Open Dashboard' : 'View Demo'}</button>
          </div>
        </div>
        <div className="au au4" style={{position:'relative',zIndex:10,display:'flex',justifyContent:'center',paddingTop:20}}>
          <LiveTicker/>
        </div>
        <div className="hproof au au5">
          {[{n:"15–20",l:"New reviews / month"},{n:"4.8★",l:"Avg client rating"},{n:"48hr",l:"Full setup time"},{n:"0 min",l:"Your time required"}].map((p,i) => (
            <div className="hpi" key={i}><div className="hpn">{p.n}</div><div className="hpl">{p.l}</div></div>
          ))}
        </div>
      </section>

      <section className="sc scl">
        <div className="sl">The Wake-Up Call</div>
        <h2 className="st stl">See where you really stand</h2>
        <p className="sd sdl">We compare your Google profile against your top local competitors and show you exactly where you're losing calls.</p>
        <div className="acard">
          <div className="ahdr"><span>Competitor Audit — Dallas, TX</span><span>Feb 2026</span></div>
          {DEMO_COMPETITORS.map((c,i) => (
            <div className="arow" key={i}>
              <div className="anm">{c.competitor_name} {c.you && <span className="ayou">You</span>}</div>
              <div className="ast"><span style={{display:'flex',alignItems:'center',gap:5}}><StarRow rating={Math.round(c.star_rating)} s={13}/><b style={{fontSize:13,color:'#0F172A'}}>{c.star_rating}</b></span><span className="arv">{c.review_count} reviews</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="sc scd">
        <div className="sl">The System</div>
        <h2 className="st std">Everything your reputation needs</h2>
        <p className="sd">We don't hand you software and wish you luck. We build and run the entire system for you.</p>
        <div className="fgrid">
          {[
            {icon:<IcoZap/>,t:"Auto Review Requests",d:"Every completed job triggers a text and email. We follow up 3 times over 5 days. You do nothing."},
            {icon:<IcoMsg/>,t:"AI-Powered Responses",d:"Every review gets a personalized response in your voice within 4 hours. Trained on your brand."},
            {icon:<IcoTarget/>,t:"Competitor Tracking",d:"Real-time monitoring of your top 5 local competitors. Counts, ratings, and growth vs. yours."},
            {icon:<IcoShield/>,t:"Google Profile Optimization",d:"Full audit and optimization of photos, categories, description, Q&A, and service areas."},
            {icon:<IcoBell/>,t:"Instant Negative Alerts",d:"Get a text within minutes of any review under 4 stars. Respond fast, protect your reputation."},
            {icon:<IcoBar/>,t:"Monthly Reports",d:"Clear reports showing growth, rating trends, and competitive positioning delivered monthly."},
          ].map((f,i) => (
            <div className="fc" key={i}><div className="fic">{f.icon}</div><div className="ftt">{f.t}</div><div className="fds">{f.d}</div></div>
          ))}
        </div>
      </section>

      <section className="sc scl" id="how">
        <div className="sl">Process</div>
        <h2 className="st stl">Three steps. Zero effort.</h2>
        <p className="sd sdl">We handle everything. You keep running your business.</p>
        <div className="steps">
          {[
            {n:"01",t:"We Set Everything Up",d:"CRM integration, Google profile optimization, AI response config, review cards, staff training. Done in 48 hours."},
            {n:"02",t:"Reviews Start Flowing",d:"Every job triggers automatic requests. We follow up via text and email. Average: 15–20 new reviews in month one."},
            {n:"03",t:"We Respond & Report",d:"Every review gets an AI response. Negatives trigger instant alerts. Monthly reports track growth vs. competitors."},
          ].map((s,i) => (
            <div className="step" key={i}><div className="snum">{s.n}</div><div className="stt">{s.t}</div><div className="sds">{s.d}</div></div>
          ))}
        </div>
      </section>

      <section className="sc scl" style={{background:'#F1F5F9'}}>
        <div className="sl">Results</div>
        <h2 className="st stl">Trusted by home service pros</h2>
        <p className="sd sdl">Real results from real contractors who use My Star.</p>
        <div className="tgrid">
          {[
            {t:"We went from 34 reviews to 89 in three months. My phone rings more than ever. Best investment I've made in my business.",a:"Marcus D.",r:"Owner, DFW Elite HVAC"},
            {t:"I signed up skeptical. By week two I had 11 new five-star reviews and didn't do a thing. The AI responses sound exactly like me.",a:"Patricia R.",r:"Owner, Reliable Plumbing Co."},
            {t:"The competitor audit alone was a wake-up call. Now I'm the top-rated roofer in my zip code. My Star made it happen.",a:"James K.",r:"Owner, Keystone Roofing"},
          ].map((t,i) => (
            <div className="tc" key={i}><StarRow rating={5} s={14}/><p className="ttx">"{t.t}"</p><div className="tau">{t.a}</div><div className="trl">{t.r}</div></div>
          ))}
        </div>
      </section>

      <ROICalculator go={go}/>

      <section className="sc scd" id="pricing">
        <div className="sl">Pricing</div>
        <h2 className="st std">One setup. One monthly. No contracts.</h2>
        <p className="sd">Cancel anytime. But you won't want to.</p>
        <div className="pgrid">
          <div className="pc">
            <div className="ptg">One-Time Setup</div>
            <div className="pam">$3,500</div>
            <p className="pdc">Complete done-for-you implementation delivered in 48 hours.</p>
            <ul className="pfl">{["CRM & dispatch integration","AI response configuration","Google Business Profile optimization","Branded review cards (250 printed)","Live staff training session","Competitor audit report","30-day acceleration sprint"].map((f,i)=>(<li className="pfi" key={i}><span className="pck">✓</span>{f}</li>))}</ul>
          </div>
          <div className="pc feat">
            <div className="ptg">Monthly</div>
            <div className="pam">$249<span className="pper">/mo</span></div>
            <p className="pdc">Ongoing automation, monitoring, and AI-powered responses.</p>
            <ul className="pfl">{["Unlimited review requests","AI responses to every review","Multi-platform monitoring","Negative review instant alerts","Monthly performance report","Quarterly GBP re-optimization","Priority support"].map((f,i)=>(<li className="pfi" key={i}><span className="pck">✓</span>{f}</li>))}</ul>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="orb"/>
        <h2 className="ctah au">Every day you wait, your<br/>competitor pulls further ahead.</h2>
        <p className="ctap au au1">Get a free competitor audit. See exactly where you stand. No commitment.</p>
        <div className="au au2" style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap',position:'relative'}}>
          <button className="b bp bl" onClick={() => go('audit')}>Get Your Free Audit <IcoArrow/></button>
          <button className="b bo bl" onClick={() => go(user ? 'dash' : 'login')}>{user ? 'Open Dashboard' : 'View Demo'}</button>
        </div>
      </section>

      <footer className="ft_">
        <Logo size={18}/>
        <div className="ftl">
          <button className="ftk" onClick={() => document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>How It Works</button>
          <button className="ftk" onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Pricing</button>
          <button className="ftk" onClick={() => go('audit')}>Free Audit</button>
        </div>
        <span className="ftc">© 2026 My Star · mystarauthority.com</span>
      </footer>
    </div>
  );
}

// ============================================================
// AUDIT PAGE
// ============================================================
function Audit({ go }) {
  const [f, sF] = useState({business:'',city:'',trade:'HVAC',phone:'',email:''});
  const [done, sD] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!f.business || !f.email) { setError('Please enter your business name and email.'); return; }
    setLoading(true); setError('');
    try { await supabase.from('audit_requests').insert({ business_name: f.business, city: f.city, trade: f.trade, phone: f.phone, email: f.email }); } catch (err) { console.error(err); }
    sD(true); setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column',position:'relative'}}>
      <div style={{position:'absolute',width:500,height:500,top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:'radial-gradient(circle,rgba(52,211,153,.04) 0%,transparent 60%)',borderRadius:'50%',pointerEvents:'none'}}/>
      <nav className="nv"><div style={{cursor:'pointer'}} onClick={()=>go('home')}><Logo size={22}/></div><button className="b bo" onClick={()=>go('home')}><IcoBack/> Back</button></nav>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 24px 80px'}}>
        {!done?(
          <div style={{maxWidth:440,width:'100%'}} className="au">
            <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:34,fontWeight:800,color:'#fff',letterSpacing:-1.2,marginBottom:10,textAlign:'center'}}>Free Competitor Audit</h2>
            <p style={{color:'#94A3B8',textAlign:'center',marginBottom:36,fontSize:15,lineHeight:1.65}}>We'll compare you against your top 5 local competitors and show you exactly where you stand.</p>
            {error && <div className="errmsg">{error}</div>}
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {[{l:'Business Name',k:'business',p:'e.g. Dallas Comfort HVAC'},{l:'City / Area',k:'city',p:'e.g. Dallas, TX'},{l:'Phone',k:'phone',p:'(555) 123-4567'},{l:'Email',k:'email',p:'you@company.com'}].map(x=>(
                <div key={x.k}><label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:1.5}}>{x.l}</label>
                <input value={f[x.k]} onChange={e=>sF({...f,[x.k]:e.target.value})} placeholder={x.p} style={inputDark} onFocus={e=>{e.target.style.borderColor='rgba(52,211,153,.4)'}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,.07)'}}/></div>
              ))}
              <div><label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:1.5}}>Trade</label>
              <select value={f.trade} onChange={e=>sF({...f,trade:e.target.value})} style={{...inputDark,appearance:'none'}}>
                {['HVAC','Plumbing','Roofing','Electrical','General Contracting','Other'].map(t=><option key={t} value={t} style={{background:'#060911'}}>{t}</option>)}
              </select></div>
              <button className="b bp bl" disabled={loading} style={{width:'100%',justifyContent:'center',marginTop:8,borderRadius:12}} onClick={handleSubmit}>
                {loading ? <span className="spinner" style={{width:16,height:16}}/> : <>Get My Free Audit <IcoArrow/></>}
              </button>
              <p style={{color:'#64748B',fontSize:12,textAlign:'center'}}>No credit card required. Report delivered within 24 hours.</p>
            </div>
          </div>
        ):(
          <div style={{textAlign:'center',maxWidth:440}} className="au">
            <div style={{width:64,height:64,borderRadius:20,background:'linear-gradient(135deg,rgba(52,211,153,.1),rgba(6,182,212,.1))',border:'1px solid rgba(52,211,153,.12)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 28px'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            </div>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:28,fontWeight:800,color:'#fff',marginBottom:12}}>Audit Requested</h2>
            <p style={{color:'#94A3B8',fontSize:15.5,lineHeight:1.7,marginBottom:32}}>We're analyzing your competitors now. Your personalized report will be delivered within 24 hours.</p>
            <button className="b bp bl" onClick={()=>go('home')}>Back to Home <IcoArrow/></button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dash({ go, user, onLogout }) {
  const [tab, sT] = useState('overview');
  const [reviews, setReviews] = useState(null);
  const [competitors, setCompetitors] = useState(null);
  const [company, setCompany] = useState(null);
  const [profile, setProfile] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const liveReviews = reviews && reviews.length > 0 ? reviews : DEMO_REVIEWS;
  const liveCompetitors = competitors && competitors.length > 0 ? competitors : DEMO_COMPETITORS;
  const liveMonths = monthlyData && monthlyData.length > 0 ? monthlyData : DEMO_MONTHS;
  const totalReviews = liveCompetitors.find(c => c.you)?.review_count || liveReviews.length;
  const avgRating = liveCompetitors.find(c => c.you)?.star_rating || (liveReviews.reduce((a, r) => a + r.rating, 0) / liveReviews.length).toFixed(1);
  const responseRate = liveReviews.length > 0 ? Math.round((liveReviews.filter(r => r.ai_response_status === 'posted').length / liveReviews.length) * 100) : 96;
  const reviewsThisMonth = liveMonths.length > 0 ? liveMonths[liveMonths.length - 1].r || liveMonths[liveMonths.length - 1].reviews_gained || 0 : 0;

  const fetchData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (p) setProfile(p);
      if (p?.company_id) {
        const [c, r, comp, s] = await Promise.all([
          supabase.from('companies').select('*').eq('id', p.company_id).single(),
          supabase.from('reviews').select('*').eq('company_id', p.company_id).order('review_date', { ascending: false }),
          supabase.from('competitors').select('*').eq('company_id', p.company_id).order('review_count', { ascending: false }),
          supabase.from('monthly_stats').select('*').eq('company_id', p.company_id).order('month_year', { ascending: true }),
        ]);
        if (c.data) setCompany(c.data);
        if (r.data) setReviews(r.data);
        if (comp.data) setCompetitors(comp.data);
        if (s.data) setMonthlyData(s.data.map(x => ({ m: x.month_year.slice(5), r: x.reviews_gained })));
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel('rv').on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, (p) => {
      if (p.eventType === 'INSERT') setReviews(prev => prev ? [p.new, ...prev] : [p.new]);
      if (p.eventType === 'UPDATE') setReviews(prev => prev ? prev.map(r => r.id === p.new.id ? p.new : r) : prev);
    }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const mx = Math.max(...liveMonths.map(d => d.r || d.reviews_gained || 1));
  const isDemo = !reviews || reviews.length === 0;

  return (
    <div className="dsh">
      <aside className="sb">
        <div className="sbl" style={{cursor:'pointer'}} onClick={()=>go('home')}><Logo size={19}/></div>
        {isDemo && <div className="demobadge"><IcoStar s={14}/> Demo Mode — sample data</div>}
        <div className="sbsc">Main</div>
        {[{id:'overview',ic:<IcoBar/>,l:'Overview'},{id:'reviews',ic:<IcoMsg/>,l:'Reviews'},{id:'competitors',ic:<IcoUsers/>,l:'Competitors'}].map(n=>(
          <button key={n.id} className={`ni ${tab===n.id?'ac':''}`} onClick={()=>sT(n.id)}>{n.ic}{n.l}</button>
        ))}
        <div className="sbsc">Account</div>
        <button className={`ni ${tab==='settings'?'ac':''}`} onClick={()=>sT('settings')}><IcoGear/>Settings</button>
        <div className="sbsp"/>
        {user && <button className="ni" onClick={async()=>{await supabase.auth.signOut();onLogout();}} style={{color:'#F87171'}}><IcoLogout/>Sign Out</button>}
        <button className="ni" onClick={()=>go('home')}><IcoBack/>Back to Site</button>
      </aside>
      <main className="dm">
        {loading ? (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh',flexDirection:'column',gap:16}}>
            <div className="spinner-dark" style={{width:28,height:28,borderWidth:3}}/><p style={{color:'#64748B',fontSize:13.5}}>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {tab==='overview'&&<Overview liveReviews={liveReviews} liveCompetitors={liveCompetitors} liveMonths={liveMonths} totalReviews={totalReviews} avgRating={avgRating} responseRate={responseRate} reviewsThisMonth={reviewsThisMonth} mx={mx} user={user} profile={profile}/>}
            {tab==='reviews'&&<ReviewsTab reviews={liveReviews}/>}
            {tab==='competitors'&&<CompTab competitors={liveCompetitors} totalReviews={totalReviews}/>}
            {tab==='settings'&&<SetTab company={company} profile={profile} user={user}/>}
          </>
        )}
      </main>
    </div>
  );
}

// ============================================================
// DASHBOARD TABS
// ============================================================
function Overview({liveReviews,liveCompetitors,liveMonths,totalReviews,avgRating,responseRate,reviewsThisMonth,mx,user,profile}) {
  return (<>
    <div className="dh"><div><h1 className="dti">Dashboard</h1><p className="dsu">Welcome back{user ? `, ${profile?.full_name || user.email.split('@')[0]}` : ''}. Your reputation at a glance.</p></div><button className="b bd" style={{fontSize:12.5,borderRadius:100}}>Download Report</button></div>
    <div className="sgrd">
      {[{l:'Total Reviews',v:String(totalReviews),c:`+${reviewsThisMonth} this month`,u:true},{l:'Star Rating',v:String(avgRating),c:'+0.1 from last month',u:true,s:true},{l:'Response Rate',v:`${responseRate}%`,c:'AI-powered',u:true},{l:'Local Rank',v:'#2',c:'Closing the gap',u:true}].map((s,i)=>(
        <div className="sc_" key={i}><div className="scl">{s.l}</div><div style={{display:'flex',alignItems:'center',gap:8}}><div className="scv">{s.v}</div>{s.s&&<StarRow rating={5} s={14}/>}</div><div className={`sch ${s.u?'su':'sdn'}`}><IcoTrend/>{s.c}</div></div>
      ))}
    </div>
    <div className="cr">
      <div className="cd"><div className="cdt">Reviews Per Month</div><div className="bcr">{liveMonths.map((d,i)=>(<div className="bcl" key={i}><div className="bvl">{d.r||d.reviews_gained}</div><div className="bfl" style={{height:`${((d.r||d.reviews_gained)/mx)*100}%`}}/><div className="blb">{d.m}</div></div>))}</div></div>
      <div className="cd"><div className="cdt">Competitor Snapshot</div><table className="tb"><thead><tr><th>Company</th><th>Reviews</th><th>Rating</th><th>+/mo</th></tr></thead><tbody>{liveCompetitors.slice(0,4).map((c,i)=>(<tr key={i} className={c.you?'hl':''}><td style={{fontWeight:c.you?700:500,color:c.you?'#0F172A':'#64748B'}}>{c.competitor_name}{c.you&&<span style={{color:'#34D399',fontSize:9,marginLeft:8,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',letterSpacing:1}}>You</span>}</td><td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:12.5,color:'#0F172A'}}>{c.review_count}</td><td><StarRow rating={Math.round(c.star_rating)} s={10}/> <span style={{fontSize:11.5,color:'#64748B'}}>{c.star_rating}</span></td><td style={{color:'#059669',fontWeight:600,fontFamily:"'JetBrains Mono',monospace",fontSize:11.5}}>+{c.monthly_growth}</td></tr>))}</tbody></table></div>
    </div>
    <div className="cd"><div className="cdt">Recent Reviews</div>{liveReviews.slice(0,3).map(r=><Rev key={r.id} r={r}/>)}</div>
  </>);
}

function Rev({r}) {
  const date = r.review_date ? (typeof r.review_date === 'string' && r.review_date.includes('T') ? new Date(r.review_date).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'}) : r.review_date) : '';
  const responded = r.ai_response_status === 'posted';
  const pending = r.ai_response_status === 'pending' || r.ai_response_status === 'generated';
  return (
    <div className={`rv ${r.rating<3?'neg':''}`}>
      <div className="rvh">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#F1F5F9,#E2E8F0)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#64748B',fontFamily:"'Sora',sans-serif"}}>{(r.author_name||'?')[0]}</div>
          <div><span className="rva">{r.author_name}</span><div style={{marginTop:2}}><StarRow rating={r.rating} s={12}/></div></div>
        </div>
        <div className="rvm"><span className={`rvp ${r.platform==='Google'?'rvg':'rvy'}`}>{r.platform}</span><span>{date}</span></div>
      </div>
      <div className="rvt">{r.review_text}</div>
      {responded && r.ai_response ? (<div className="rvr"><div className="rvrl"><IcoCheck/> AI Response Sent</div><div className="rvrt">{r.ai_response}</div></div>) : pending ? (<div className="rvpd"><IcoBell/> AI response generating — posted within 4 hours</div>) : null}
    </div>
  );
}

function ReviewsTab({ reviews }) {
  const [f,sF]=useState('all');
  const fl = f==='all'?reviews:f==='pos'?reviews.filter(r=>r.rating>=4):f==='neg'?reviews.filter(r=>r.rating<4):reviews.filter(r=>r.ai_response_status==='pending');
  return (<>
    <div className="dh"><div><h1 className="dti">Reviews</h1><p className="dsu">All reviews across Google, Yelp, and Facebook.</p></div></div>
    <div style={{display:'flex',gap:6,marginBottom:20}}>{[{k:'all',l:'All'},{k:'pos',l:'4–5 Stars'},{k:'neg',l:'Needs Attention'},{k:'pend',l:'Pending'}].map(x=>(<button key={x.k} onClick={()=>sF(x.k)} className="b" style={{background:f===x.k?'#0F172A':'#fff',color:f===x.k?'#fff':'#64748B',border:`1px solid ${f===x.k?'#0F172A':'#E2E8F0'}`,padding:'7px 16px',fontSize:12,borderRadius:100,fontWeight:600}}>{x.l}</button>))}</div>
    {fl.length === 0 ? <div style={{textAlign:'center',padding:48,color:'#64748B',fontSize:14}}>No reviews in this category yet.</div> : fl.map(r=><Rev key={r.id} r={r}/>)}
  </>);
}

function CompTab({ competitors, totalReviews }) {
  const yourReviews = competitors.find(c => c.you)?.review_count || totalReviews;
  return (<>
    <div className="dh"><div><h1 className="dti">Competitors</h1><p className="dsu">Track local competitors in real time.</p></div></div>
    <div className="cd"><table className="tb"><thead><tr><th>Company</th><th>Reviews</th><th>Rating</th><th>Growth</th><th>Gap</th></tr></thead><tbody>{competitors.map((c,i)=>(<tr key={i} className={c.you?'hl':''}><td style={{fontWeight:c.you?700:500,color:c.you?'#0F172A':'#64748B'}}>{c.competitor_name}{c.you&&<span style={{color:'#34D399',fontSize:9,marginLeft:8,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",textTransform:'uppercase',letterSpacing:1}}>You</span>}</td><td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:12.5,color:'#0F172A'}}>{c.review_count}</td><td><StarRow rating={Math.round(c.star_rating)} s={10}/> <span style={{fontSize:11.5}}>{c.star_rating}</span></td><td style={{color:'#059669',fontWeight:600,fontFamily:"'JetBrains Mono',monospace",fontSize:11.5}}>+{c.monthly_growth}/mo</td><td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,fontSize:11.5,color:c.you?'#34D399':(c.review_count>yourReviews?'#F87171':'#64748B')}}>{c.you?'—':c.review_count>yourReviews?`${c.review_count-yourReviews} ahead`:`${yourReviews-c.review_count} behind`}</td></tr>))}</tbody></table></div>
    {(() => {
      const leader = competitors.filter(c => !c.you).sort((a,b) => b.review_count - a.review_count)[0];
      if (!leader || leader.review_count <= yourReviews) return null;
      return <div style={{marginTop:16,padding:18,background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:14,display:'flex',gap:12,alignItems:'flex-start'}}><IcoAlert/><div><div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:14,color:'#991B1B',marginBottom:3}}>Gap Alert</div><p style={{fontSize:13,color:'#991B1B',lineHeight:1.6}}>{leader.competitor_name} is {leader.review_count - yourReviews} reviews ahead of you.</p></div></div>;
    })()}
  </>);
}

function SetTab({ company, profile, user }) {
  return (<>
    <div className="dh"><div><h1 className="dti">Settings</h1><p className="dsu">Manage your account and preferences.</p></div></div>
    <div className="cd" style={{maxWidth:500}}>
      {[{l:'Business Name',v:company?.name||'Not configured'},{l:'Phone',v:company?.phone||profile?.phone||''},{l:'Email',v:user?.email||''}].map((f,i)=>(<div key={i} style={{marginBottom:20}}><label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:1.5}}>{f.l}</label><input defaultValue={f.v} style={inputLight} onFocus={e=>{e.target.style.borderColor='#34D399'}} onBlur={e=>{e.target.style.borderColor='#E2E8F0'}}/></div>))}
      <div style={{marginBottom:20}}><label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#64748B',fontWeight:600,marginBottom:8,textTransform:'uppercase',letterSpacing:1.5}}>Negative Review Alerts</label><div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:44,height:24,borderRadius:12,background:'#34D399',padding:2,cursor:'pointer'}}><div style={{width:20,height:20,borderRadius:10,background:'#fff',marginLeft:20}}/></div><span style={{fontSize:13,color:'#475569'}}>Text me for reviews under 4 stars</span></div></div>
      <div style={{paddingTop:20,borderTop:'1px solid #E2E8F0'}}><label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#64748B',fontWeight:600,marginBottom:6,textTransform:'uppercase',letterSpacing:1.5}}>Subscription</label><div style={{display:'flex',alignItems:'center',gap:12}}><span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:22,color:'#0F172A'}}>$249/mo</span><span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:company?.subscription_status==='active'?'#059669':'#92400E',fontWeight:700,background:company?.subscription_status==='active'?'#ECFDF5':'#FFFBEB',padding:'4px 12px',borderRadius:100,textTransform:'uppercase',letterSpacing:1}}>{company?.subscription_status || 'Demo'}</span></div><p style={{fontSize:12.5,color:'#64748B',marginTop:4}}>Month-to-month · Cancel anytime</p></div>
    </div>
  </>);
}

// ============================================================
// APP
// ============================================================
export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user || null); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { setUser(session?.user || null); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const go = (p) => setPage(p);
  const handleAuth = (u) => { setUser(u); setPage('dash'); };
  const handleLogout = () => { setUser(null); setPage('home'); };

  if (authLoading) return (
    <div style={{minHeight:'100vh',background:'#060911',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:20}}>
      <Logo size={30}/><div className="spinner" style={{width:22,height:22}}/>
    </div>
  );

  return (
    <>
      {page==='home' && <Landing go={go} user={user}/>}
      {page==='dash' && <Dash go={go} user={user} onLogout={handleLogout}/>}
      {page==='audit' && <Audit go={go}/>}
      {page==='login' && <AuthPage go={go} onAuth={handleAuth}/>}
    </>
  );
}
