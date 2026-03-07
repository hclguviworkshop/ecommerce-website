import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Nunito:wght@300;400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal: #1a7a5e;
    --purple: #7B2D8B;
    --text: #1a1a1a;
    --muted: #666;
    --bg: #faf8f5;
  }

  html, body, #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-family: 'Nunito', sans-serif;
  }

  .app {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .page {
    width: 100vw;
    height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    position: relative;
    overflow: hidden;
  }

  .home {
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .home-logo {
    width: clamp(240px, 35vw, 480px);
    animation: popIn 1s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes popIn {
    from { opacity:0; transform: scale(0.88) translateY(24px); }
    to   { opacity:1; transform: none; }
  }

  .home-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: clamp(14px, 1.4vw, 20px);
    color: var(--muted);
    letter-spacing: 0.14em;
    margin-top: 12px;
    animation: fadeUp 1s 0.4s both;
  }

  .home-hint {
    position: absolute;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    animation: fadeUp 1s 0.8s both;
  }

  .home-hint span {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--purple);
  }

  .chevron {
    width: 24px; height: 24px;
    border-right: 2.5px solid var(--purple);
    border-bottom: 2.5px solid var(--purple);
    transform: rotate(45deg);
    animation: bounce 1.5s infinite;
  }

  @keyframes bounce {
    0%,100% { transform: rotate(45deg) translateY(0); }
    50%      { transform: rotate(45deg) translateY(7px); }
  }

  @keyframes fadeUp {
    from { opacity:0; transform: translateY(14px); }
    to   { opacity:1; transform: none; }
  }

  .listing {
    background: var(--bg);
    display: flex;
    flex-direction: column;
  }

  .nav {
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 0 48px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .nav-logo { width: 80px; }

  .nav-links { display: flex; gap: 24px; }

  .nav-links span {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    transition: color 0.2s;
  }

  .nav-links span:hover, .nav-links span.active { color: var(--teal); }
  .nav-icons { display: flex; gap: 16px; font-size: 18px; cursor: pointer; }

  .listing-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px 48px 32px;
  }

  .listing-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .listing-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-style: italic;
    color: var(--text);
  }

  .item-count { font-size: 12px; color: var(--muted); }

  .filters {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .chip {
    padding: 5px 15px;
    border-radius: 20px;
    border: 1.5px solid #ddd;
    background: #fff;
    font-family: 'Nunito', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
  }

  .chip:hover { border-color: var(--teal); color: var(--teal); }
  .chip.on { background: var(--teal); color: #fff; border-color: var(--teal); }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  .pcard {
    background: #fff;
    border-radius: 4px;
    border: 1px solid #eee;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .pcard:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(26,122,94,0.13);
  }

  .pcard-img {
    width: 100%;
    aspect-ratio: 3/4;
    background: #f5f0eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 52px;
  }

  .pcard-body { padding: 10px 12px 12px; }
  .pcard-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--purple); margin-bottom: 3px; }
  .pcard-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--text); margin-bottom: 2px; }
  .pcard-sub { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
  .pcard-foot { display: flex; align-items: center; justify-content: space-between; }
  .pcard-price { font-size: 14px; font-weight: 700; color: var(--teal); }
  .pcard-orig { font-size: 11px; color: #bbb; text-decoration: line-through; margin-left: 5px; }
  .heart { background: none; border: none; font-size: 16px; cursor: pointer; color: #ddd; transition: color 0.2s; }
  .heart.on { color: var(--purple); }

  .detail { background: #fff; display: flex; flex-direction: column; }

  .detail-nav {
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #eee;
    padding: 0 48px;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  .back { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--muted); transition: color 0.2s; }
  .back:hover { color: var(--teal); }

  .detail-content {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 52px;
    padding: 32px 80px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }

  .big-img {
    width: 100%;
    aspect-ratio: 3/4;
    background: #f5f0eb;
    border-radius: 4px;
    border: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 110px;
  }

  .thumbs { display: flex; gap: 10px; margin-top: 12px; }

  .thumb {
    width: 58px; height: 58px;
    background: #f5f0eb;
    border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    border: 1.5px solid transparent;
    cursor: pointer;
  }
  .thumb.on { border-color: var(--teal); }

  .detail-right { padding-top: 4px; }

  .d-badge { display: inline-block; background: #f0faf5; color: var(--teal); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
  .d-name { font-family: 'Cormorant Garamond', serif; font-size: 30px; color: var(--text); margin-bottom: 4px; line-height: 1.2; }
  .d-brand { font-size: 13px; color: var(--muted); margin-bottom: 14px; }
  .d-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 18px; }
  .d-price { font-size: 26px; font-weight: 700; color: var(--teal); }
  .d-orig { font-size: 16px; color: #bbb; text-decoration: line-through; }
  .d-save { font-size: 11px; color: var(--purple); font-weight: 700; background: #faf0ff; padding: 3px 10px; border-radius: 20px; }
  .d-divider { height: 1px; background: #f0f0f0; margin: 14px 0; }
  .d-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); margin-bottom: 8px; }

  .sizes { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }

  .sz { padding: 7px 16px; border: 1.5px solid #ddd; border-radius: 3px; background: #fff; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 600; color: var(--text); cursor: pointer; transition: all 0.2s; }
  .sz:hover { border-color: var(--teal); color: var(--teal); }
  .sz.on { background: var(--teal); color: #fff; border-color: var(--teal); }

  .condition-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
  .cond-dot { width: 10px; height: 10px; border-radius: 50%; background: #27ae60; }
  .cond-text { font-size: 13px; font-weight: 600; color: var(--text); }
  .cond-sub { font-size: 11px; color: var(--muted); }

  .btn-cart { width: 100%; padding: 13px; background: var(--teal); color: #fff; border: none; border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 10px; box-shadow: 0 3px 0 #0e5c44; transition: background 0.2s; }
  .btn-cart:hover { background: #156b50; }
  .btn-wish { width: 100%; padding: 12px; background: #fff; color: var(--purple); border: 1.5px solid var(--purple); border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .btn-wish:hover { background: #faf0ff; }

  .meta { margin-top: 18px; display: flex; flex-direction: column; }
  .meta-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
  .meta-row b { color: var(--text); font-weight: 600; }

  .auth { display: flex; align-items: center; justify-content: center; }

  .auth-bg { position: absolute; inset: 0; background-image: url('/bg-pattern.jpg'); background-size: cover; background-position: center; }
  .auth-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.72); }

  .auth-card { position: relative; z-index: 2; width: 90%; max-width: 460px; background: rgba(255,255,255,0.96); border-radius: 4px; border: 1px solid rgba(123,45,139,0.14); box-shadow: 0 4px 0 var(--teal), 0 16px 60px rgba(26,122,94,0.18); overflow: hidden; }

  .card-top { display: flex; justify-content: center; padding: 22px 32px 0; }
  .card-logo { width: 120px; }

  .tabs { display: grid; grid-template-columns: 1fr 1fr; margin: 16px 32px 0; border-bottom: 2px solid #eee; }

  .tab { padding: 10px 0; background: none; border: none; font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #bbb; cursor: pointer; position: relative; transition: color 0.2s; }
  .tab.on { color: var(--purple); }
  .tab.on::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2.5px; background: var(--purple); border-radius: 2px 2px 0 0; }

  .card-body { padding: 18px 32px 26px; }

  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .field { margin-bottom: 13px; }
  .field label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); margin-bottom: 5px; }
  .field input { width: 100%; padding: 10px 13px; border: 1.5px solid #e0e0e0; border-radius: 3px; background: #fafafa; font-family: 'Nunito', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .field input:focus { border-color: var(--purple); background: #fff; box-shadow: 0 0 0 3px rgba(123,45,139,0.09); }
  .field input::placeholder { color: #ccc; }

  .pw-wrap { position: relative; }
  .pw-wrap input { padding-right: 36px; }
  .eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #bbb; font-size: 14px; }

  .str-row { display: flex; gap: 3px; margin-top: 5px; }
  .s { height: 3px; flex: 1; border-radius: 2px; background: #eee; transition: background 0.3s; }
  .s.w { background: #c0392b; }
  .s.f { background: #e67e22; }
  .s.g { background: var(--teal); }
  .s.x { background: #27ae60; }

  .ferr { font-size: 11px; color: #c0392b; margin-top: 3px; }

  .chk { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 16px; }
  .chk input { width: 14px; height: 14px; margin-top: 2px; accent-color: var(--purple); cursor: pointer; flex-shrink: 0; }
  .chk label { font-size: 11px; color: var(--muted); line-height: 1.6; cursor: pointer; }
  .chk label a { color: var(--purple); font-weight: 700; text-decoration: none; }

  .btn-sub { width: 100%; padding: 12px; background: var(--teal); color: #fff; border: none; border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 12px; box-shadow: 0 3px 0 #0e5c44; transition: background 0.2s; }
  .btn-sub:hover { background: #156b50; }
  .btn-sub:disabled { opacity: 0.6; cursor: not-allowed; }

  .div { display: flex; align-items: center; gap: 10px; color: #ccc; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
  .div::before, .div::after { content:''; flex:1; height:1px; background:#eee; }

  .socs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .soc { display: flex; align-items: center; justify-content: center; gap: 7px; padding: 9px; border: 1.5px solid #e8e8e8; border-radius: 3px; background: #fff; font-family: 'Nunito', sans-serif; font-size: 12px; color: var(--text); font-weight: 600; cursor: pointer; transition: border-color 0.2s; }
  .soc:hover { border-color: #ccc; }

  .forgot { display: block; text-align: right; font-size: 11px; color: var(--purple); text-decoration: none; font-weight: 600; margin-top: -8px; margin-bottom: 14px; }

  .done { text-align: center; padding: 10px 0; }
  .done-icon { width: 54px; height: 54px; background: linear-gradient(135deg, var(--teal), #2ecc9a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 22px; color: #fff; }
  .done h3 { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-style: italic; color: var(--text); margin-bottom: 6px; }
  .done p { font-size: 12px; color: var(--muted); line-height: 1.7; }
`;

const PRODUCTS = [
  { id:1, emoji:"👗", name:"Floral Wrap Dress",  brand:"Zara",         size:"S",        price:499, orig:1800, tag:"Vintage",  cond:"Excellent" },
  { id:2, emoji:"👜", name:"Leather Tote Bag",   brand:"Mango",        size:"One Size", price:799, orig:2500, tag:"90s",      cond:"Good"      },
  { id:3, emoji:"🧥", name:"Oversized Blazer",   brand:"H&M",          size:"M",        price:649, orig:2200, tag:"Y2K",      cond:"Like New"  },
  { id:4, emoji:"👟", name:"Canvas Sneakers",    brand:"Vans",         size:"7",        price:399, orig:1400, tag:"Classic",  cond:"Good"      },
  { id:5, emoji:"👚", name:"Striped Linen Top",  brand:"Gap",          size:"XS",       price:299, orig:900,  tag:"Summer",   cond:"Excellent" },
  { id:6, emoji:"🩱", name:"Denim Jumpsuit",     brand:"Levis",        size:"M",        price:899, orig:3200, tag:"Trending", cond:"Like New"  },
  { id:7, emoji:"🧣", name:"Silk Scarf",         brand:"Uniqlo",       size:"One Size", price:199, orig:600,  tag:"Vintage",  cond:"Good"      },
  { id:8, emoji:"🩴", name:"Block Heel Mules",   brand:"Steve Madden", size:"6",        price:549, orig:1900, tag:"Summer",   cond:"Excellent" },
];

const TAGS = ["All","Vintage","90s","Y2K","Classic","Summer","Trending"];
const SIZES = ["XS","S","M","L","XL"];

function pwStr(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const segCls = (i,s) => s>=i ? ["","w","f","g","x"][s] : "";

function Register() {
  const [f, setF] = useState({first:"",last:"",email:"",pw:"",pw2:"",terms:false});
  const [err, setErr] = useState({});
  const [sp, setSp] = useState(false);
  const [sp2, setSp2] = useState(false);
  const [load, setLoad] = useState(false);
  const [ok, setOk] = useState(false);

  const upd = k => e => {
    const v = e.target.type==="checkbox"?e.target.checked:e.target.value;
    setF(x=>({...x,[k]:v})); setErr(x=>({...x,[k]:""}));
  };

  const submit = async () => {
    const e={};
    if (!f.first.trim()) e.first="Required";
    if (!f.last.trim()) e.last="Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email="Valid email required";
    if (f.pw.length<8) e.pw="Min 8 characters";
    if (f.pw!==f.pw2) e.pw2="Passwords don't match";
    if (!f.terms) e.terms="Please accept to continue";
    if (Object.keys(e).length){setErr(e);return;}
    setLoad(true);
    await new Promise(r=>setTimeout(r,1400));
    setLoad(false); setOk(true);
  };

  const s = pwStr(f.pw);

  if (ok) return (
    <div className="done">
      <div className="done-icon">✓</div>
      <h3>Welcome to PreLoud!</h3>
      <p>Account created.<br/>Check your inbox to verify.</p>
    </div>
  );

  return (
    <>
      <div className="row2">
        <div className="field"><label>First Name</label><input placeholder="Jane" value={f.first} onChange={upd("first")}/>{err.first&&<div className="ferr">{err.first}</div>}</div>
        <div className="field"><label>Last Name</label><input placeholder="Doe" value={f.last} onChange={upd("last")}/>{err.last&&<div className="ferr">{err.last}</div>}</div>
      </div>
      <div className="field"><label>Email</label><input type="email" placeholder="jane@example.com" value={f.email} onChange={upd("email")}/>{err.email&&<div className="ferr">{err.email}</div>}</div>
      <div className="field">
        <label>Password</label>
        <div className="pw-wrap">
          <input type={sp?"text":"password"} placeholder="Min. 8 characters" value={f.pw} onChange={upd("pw")}/>
          <button className="eye" onClick={()=>setSp(v=>!v)} type="button">{sp?"🙈":"👁"}</button>
        </div>
        {f.pw&&<><div className="str-row">{[1,2,3,4].map(i=><div key={i} className={`s ${segCls(i,s)}`}/>)}</div><div style={{fontSize:10,marginTop:3,color:s<=1?"#c0392b":s===2?"#e67e22":s===3?"#1a7a5e":"#27ae60"}}>{["","Weak","Fair","Good","Strong"][s]}</div></>}
        {err.pw&&<div className="ferr">{err.pw}</div>}
      </div>
      <div className="field">
        <label>Confirm Password</label>
        <div className="pw-wrap">
          <input type={sp2?"text":"password"} placeholder="Repeat password" value={f.pw2} onChange={upd("pw2")}/>
          <button className="eye" onClick={()=>setSp2(v=>!v)} type="button">{sp2?"🙈":"👁"}</button>
        </div>
        {err.pw2&&<div className="ferr">{err.pw2}</div>}
      </div>
      <div className="chk">
        <input type="checkbox" id="t" checked={f.terms} onChange={upd("terms")}/>
        <label htmlFor="t">I agree to the <a href="#">Terms</a> & <a href="#">Privacy Policy</a>{err.terms&&<><br/><span style={{color:"#c0392b",fontSize:10}}>{err.terms}</span></>}</label>
      </div>
      <button className="btn-sub" onClick={submit} disabled={load}>{load?"Creating account…":"Create Account →"}</button>
      <div className="div">or sign up with</div>
      <div className="socs">
        <button className="soc">Google</button>
        <button className="soc">Facebook</button>
      </div>
    </>
  );
}

function Login() {
  const [f, setF] = useState({email:"",pw:""});
  const [sp, setSp] = useState(false);
  const [load, setLoad] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState({});

  const upd = k => e => { setF(x=>({...x,[k]:e.target.value})); setErr(x=>({...x,[k]:""})); };

  const submit = async () => {
    const e={};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email="Valid email required";
    if (!f.pw) e.pw="Password required";
    if (Object.keys(e).length){setErr(e);return;}
    setLoad(true);
    await new Promise(r=>setTimeout(r,1200));
    setLoad(false); setOk(true);
  };

  if (ok) return (
    <div className="done">
      <div className="done-icon">👋</div>
      <h3>Welcome back!</h3>
      <p>You're signed in to PreLoud.<br/>Happy thrifting!</p>
    </div>
  );

  return (
    <>
      <div className="field"><label>Email</label><input type="email" placeholder="jane@example.com" value={f.email} onChange={upd("email")}/>{err.email&&<div className="ferr">{err.email}</div>}</div>
      <div className="field">
        <label>Password</label>
        <div className="pw-wrap">
          <input type={sp?"text":"password"} placeholder="Your password" value={f.pw} onChange={upd("pw")}/>
          <button className="eye" onClick={()=>setSp(v=>!v)} type="button">{sp?"🙈":"👁"}</button>
        </div>
        {err.pw&&<div className="ferr">{err.pw}</div>}
      </div>
      <a href="#" className="forgot">Forgot password?</a>
      <button className="btn-sub" onClick={submit} disabled={load}>{load?"Signing in…":"Sign In →"}</button>
      <div className="div">or continue with</div>
      <div className="socs">
        <button className="soc">Google</button>
        <button className="soc">Facebook</button>
      </div>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("reg");
  const [filter, setFilter] = useState("All");
  const [liked, setLiked] = useState({});
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);

  const filtered = filter==="All" ? PRODUCTS : PRODUCTS.filter(p=>p.tag===filter);

  const goToDetail = (p) => {
    setProduct(p);
    setAdded(false);
    document.getElementById("page3").scrollIntoView({behavior:"smooth"});
  };

  const goToListing = () => {
    document.getElementById("page2").scrollIntoView({behavior:"smooth"});
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">

        <div className="page home" id="page1">
          <img src="/logo.png" alt="PreLoud" className="home-logo" />
          <p className="home-tagline">local online thrift</p>
          <div className="home-hint" onClick={()=>document.getElementById("page2").scrollIntoView({behavior:"smooth"})}>
            <span>Swipe up to explore</span>
            <div className="chevron" />
          </div>
        </div>

        <div className="page listing" id="page2">
          <div className="nav">
            <img src="/logo.png" alt="PreLoud" className="nav-logo" />
            <div className="nav-links">
              <span className="active">Women</span>
              <span>Men</span>
              <span>Accessories</span>
              <span>Bags</span>
              <span>Shoes</span>
            </div>
            <div className="nav-icons">
              <span>🔍</span><span>🛒</span><span>👤</span>
            </div>
          </div>
          <div className="listing-content">
            <div className="listing-top">
              <h2 className="listing-heading">All Finds</h2>
              <span className="item-count">{filtered.length} items</span>
            </div>
            <div className="filters">
              {TAGS.map(t=>(
                <button key={t} className={`chip ${filter===t?"on":""}`} onClick={()=>setFilter(t)}>{t}</button>
              ))}
            </div>
            <div className="grid">
              {filtered.map(p=>(
                <div key={p.id} className="pcard" onClick={()=>goToDetail(p)}>
                  <div className="pcard-img">{p.emoji}</div>
                  <div className="pcard-body">
                    <div className="pcard-tag">{p.tag}</div>
                    <div className="pcard-name">{p.name}</div>
                    <div className="pcard-sub">Size {p.size} · {p.brand}</div>
                    <div className="pcard-foot">
                      <div>
                        <span className="pcard-price">₹{p.price}</span>
                        <span className="pcard-orig">₹{p.orig}</span>
                      </div>
                      <button className={`heart ${liked[p.id]?"on":""}`} onClick={e=>{e.stopPropagation();setLiked(l=>({...l,[p.id]:!l[p.id]}));}}>
                        {liked[p.id]?"♥":"♡"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="page detail" id="page3">
          <div className="detail-nav">
            <button className="back" onClick={goToListing}>←</button>
            <img src="/logo.png" alt="PreLoud" className="nav-logo" />
          </div>
          {product ? (
            <div className="detail-content">
              <div>
                <div className="big-img">{product.emoji}</div>
                <div className="thumbs">
                  {[product.emoji,"📸","🏷️","📦"].map((e,i)=>(
                    <div key={i} className={`thumb ${i===0?"on":""}`}>{e}</div>
                  ))}
                </div>
              </div>
              <div className="detail-right">
                <div className="d-badge">✦ {product.tag}</div>
                <h2 className="d-name">{product.name}</h2>
                <p className="d-brand">by {product.brand}</p>
                <div className="d-price-row">
                  <span className="d-price">₹{product.price}</span>
                  <span className="d-orig">₹{product.orig}</span>
                  <span className="d-save">{Math.round((1-product.price/product.orig)*100)}% off</span>
                </div>
                <div className="d-divider"/>
                <div className="d-label">Select Size</div>
                <div className="sizes">
                  {SIZES.map(sz=>(
                    <button key={sz} className={`sz ${size===sz?"on":""}`} onClick={()=>setSize(sz)}>{sz}</button>
                  ))}
                </div>
                <div className="d-label">Condition</div>
                <div className="condition-row">
                  <div className="cond-dot"/>
                  <div>
                    <div className="cond-text">{product.cond}</div>
                    <div className="cond-sub">Verified by PreLoud team</div>
                  </div>
                </div>
                <button className="btn-cart" onClick={()=>setAdded(true)}>{added?"✓ Added to Cart!":"Add to Cart"}</button>
                <button className="btn-wish">♡ Add to Wishlist</button>
                <div className="meta">
                  <div className="meta-row"><span>Brand</span><b>{product.brand}</b></div>
                  <div className="meta-row"><span>Size</span><b>{size}</b></div>
                  <div className="meta-row"><span>Condition</span><b>{product.cond}</b></div>
                  <div className="meta-row"><span>Listed</span><b>2 days ago</b></div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
              <span style={{fontSize:48}}>👆</span>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontStyle:"italic",color:"#aaa"}}>Click any product to see details</p>
            </div>
          )}
        </div>

        <div className="page auth" id="page4">
          <div className="auth-bg"/>
          <div className="auth-overlay"/>
          <div className="auth-card">
            <div className="card-top">
              <img src="/logo.png" alt="PreLoud" className="card-logo"/>
            </div>
            <div className="tabs">
              <button className={`tab ${tab==="reg"?"on":""}`} onClick={()=>setTab("reg")}>Register</button>
              <button className={`tab ${tab==="log"?"on":""}`} onClick={()=>setTab("log")}>Sign In</button>
            </div>
            <div className="card-body">
              {tab==="reg" ? <Register key="r"/> : <Login key="l"/>}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}