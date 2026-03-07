import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #FAF7F2;
    --ink: #1A1208;
    --gold: #C49A3C;
    --gold-light: #E8C96A;
    --rust: #8B3A2F;
    --mist: #EDE8DF;
    --shadow: rgba(26,18,8,0.12);
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    min-height: 100vh;
  }

  .page {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
  }

  /* LEFT PANEL */
  .left-panel {
    background: var(--ink);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
  }

  .left-panel::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(196,154,60,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .left-panel::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(139,58,47,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1;
  }

  .brand-icon {
    width: 36px; height: 36px;
    background: var(--gold);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--cream);
    letter-spacing: 0.05em;
  }

  .hero-copy {
    z-index: 1;
  }

  .hero-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 4vw, 52px);
    font-weight: 300;
    color: var(--cream);
    line-height: 1.2;
    margin-bottom: 20px;
  }

  .hero-tagline em {
    font-style: italic;
    color: var(--gold-light);
  }

  .hero-sub {
    font-size: 14px;
    color: rgba(250,247,242,0.55);
    line-height: 1.7;
    max-width: 320px;
    font-weight: 300;
  }

  .perks {
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 1;
  }

  .perk {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(250,247,242,0.7);
    font-size: 13px;
    font-weight: 300;
  }

  .perk-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
  }

  /* RIGHT PANEL */
  .right-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 32px;
    background: var(--cream);
  }

  .form-container {
    width: 100%;
    max-width: 420px;
  }

  .form-header {
    margin-bottom: 36px;
  }

  .form-header h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px;
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 6px;
  }

  .form-header p {
    font-size: 13px;
    color: #7A6E60;
    font-weight: 300;
  }

  .form-header p a {
    color: var(--rust);
    text-decoration: none;
    font-weight: 500;
  }

  .form-header p a:hover { text-decoration: underline; }

  /* INPUTS */
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .field {
    margin-bottom: 18px;
  }

  .field label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #7A6E60;
    margin-bottom: 7px;
  }

  .input-wrap {
    position: relative;
  }

  .input-wrap input,
  .input-wrap select {
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid var(--mist);
    border-radius: 8px;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }

  .input-wrap input:focus,
  .input-wrap select:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(196,154,60,0.12);
  }

  .input-wrap input.error,
  .input-wrap select.error {
    border-color: var(--rust);
  }

  .input-wrap input::placeholder { color: #C4BAB0; }

  .eye-btn {
    position: absolute;
    right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    cursor: pointer;
    color: #A09080;
    font-size: 16px;
    padding: 2px;
    line-height: 1;
  }

  .err-msg {
    font-size: 11px;
    color: var(--rust);
    margin-top: 4px;
    font-weight: 400;
  }

  /* PASSWORD STRENGTH */
  .strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  .strength-seg {
    height: 3px;
    flex: 1;
    border-radius: 2px;
    background: var(--mist);
    transition: background 0.3s;
  }

  .strength-seg.weak { background: var(--rust); }
  .strength-seg.fair { background: #D4873A; }
  .strength-seg.good { background: var(--gold); }
  .strength-seg.strong { background: #5A8A4A; }

  .strength-label {
    font-size: 11px;
    margin-top: 4px;
    font-weight: 500;
  }

  /* CHECKBOX */
  .check-field {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 24px;
  }

  .check-field input[type="checkbox"] {
    width: 16px; height: 16px;
    margin-top: 2px;
    accent-color: var(--gold);
    cursor: pointer;
    flex-shrink: 0;
  }

  .check-field label {
    font-size: 12px;
    color: #7A6E60;
    line-height: 1.6;
    cursor: pointer;
  }

  .check-field label a {
    color: var(--rust);
    text-decoration: none;
    font-weight: 500;
  }

  /* SUBMIT */
  .submit-btn {
    width: 100%;
    padding: 14px;
    background: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
  }

  .submit-btn:hover { background: #2E2414; }
  .submit-btn:active { transform: scale(0.99); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .submit-btn .btn-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
    transform: translateX(-100%);
    animation: shimmer 2.5s infinite;
  }

  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }

  /* DIVIDER */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    color: #C4BAB0;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--mist);
  }

  /* SOCIAL */
  .social-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px;
    border: 1.5px solid var(--mist);
    border-radius: 8px;
    background: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--ink);
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-weight: 400;
  }

  .social-btn:hover {
    border-color: #C4BAB0;
    box-shadow: 0 2px 8px var(--shadow);
  }

  /* SUCCESS */
  .success-screen {
    text-align: center;
    padding: 20px 0;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .success-icon {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    font-size: 28px;
  }

  .success-screen h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 400;
    color: var(--ink);
    margin-bottom: 10px;
  }

  .success-screen p {
    font-size: 13px;
    color: #7A6E60;
    line-height: 1.7;
    font-weight: 300;
  }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .page { grid-template-columns: 1fr; }
    .left-panel { display: none; }
    .right-panel { padding: 40px 24px; }
    .row { grid-template-columns: 1fr; gap: 0; }
  }
`;

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "weak", "fair", "good", "strong"];
  return { score, label: map[score], color: colors[score] };
}

export default function RegistrationPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", password: "", confirmPassword: "",
    gender: "", terms: false
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(form.password);

  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [k]: val }));
    setErrors(er => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (form.phone && !form.phone.match(/^\+?[\d\s\-()]{7,15}$/)) e.phone = "Invalid phone number";
    if (form.password.length < 8) e.password = "Min. 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.gender) e.gender = "Please select";
    if (!form.terms) e.terms = "You must accept to continue";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="page">
        {/* LEFT */}
        <div className="left-panel">
          <div className="brand">
            <div className="brand-icon">✦</div>
            <span className="brand-name">MAISON</span>
          </div>

          <div className="hero-copy">
            <h1 className="hero-tagline">
              Shop the world's<br /><em>finest</em> collections
            </h1>
            <p className="hero-sub">
              Curated luxury, delivered to your door. Join thousands of discerning shoppers who trust Maison for their most treasured finds.
            </p>
          </div>

          <div className="perks">
            {["Exclusive member-only offers & early access", "Free express shipping on orders over ₹5,000", "Concierge returns — no questions asked", "Earn reward points on every purchase"].map(p => (
              <div className="perk" key={p}>
                <div className="perk-dot" />
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <div className="form-container">
            {success ? (
              <div className="success-screen">
                <div className="success-icon">✓</div>
                <h3>Welcome to Maison</h3>
                <p>Your account has been created successfully.<br />Check your inbox to verify your email address.</p>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <h2>Create account</h2>
                  <p>Already a member? <a href="#">Sign in</a></p>
                </div>

                {/* Name Row */}
                <div className="row">
                  <div className="field">
                    <label>First Name</label>
                    <div className="input-wrap">
                      <input
                        className={errors.firstName ? "error" : ""}
                        placeholder="Jane"
                        value={form.firstName}
                        onChange={set("firstName")}
                      />
                    </div>
                    {errors.firstName && <div className="err-msg">{errors.firstName}</div>}
                  </div>
                  <div className="field">
                    <label>Last Name</label>
                    <div className="input-wrap">
                      <input
                        className={errors.lastName ? "error" : ""}
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={set("lastName")}
                      />
                    </div>
                    {errors.lastName && <div className="err-msg">{errors.lastName}</div>}
                  </div>
                </div>

                {/* Email */}
                <div className="field">
                  <label>Email Address</label>
                  <div className="input-wrap">
                    <input
                      type="email"
                      className={errors.email ? "error" : ""}
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={set("email")}
                    />
                  </div>
                  {errors.email && <div className="err-msg">{errors.email}</div>}
                </div>

                {/* Phone + Gender */}
                <div className="row">
                  <div className="field">
                    <label>Phone (optional)</label>
                    <div className="input-wrap">
                      <input
                        className={errors.phone ? "error" : ""}
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={set("phone")}
                      />
                    </div>
                    {errors.phone && <div className="err-msg">{errors.phone}</div>}
                  </div>
                  <div className="field">
                    <label>Gender</label>
                    <div className="input-wrap">
                      <select
                        className={errors.gender ? "error" : ""}
                        value={form.gender}
                        onChange={set("gender")}
                      >
                        <option value="">Select</option>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>
                    {errors.gender && <div className="err-msg">{errors.gender}</div>}
                  </div>
                </div>

                {/* Password */}
                <div className="field">
                  <label>Password</label>
                  <div className="input-wrap">
                    <input
                      type={showPw ? "text" : "password"}
                      className={errors.password ? "error" : ""}
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={set("password")}
                    />
                    <button className="eye-btn" onClick={() => setShowPw(v => !v)} type="button">
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {form.password && (
                    <>
                      <div className="strength-bar">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`strength-seg ${strength.score >= i ? strength.color : ""}`} />
                        ))}
                      </div>
                      <div className="strength-label" style={{ color: strength.score <= 1 ? "var(--rust)" : strength.score === 2 ? "#D4873A" : strength.score === 3 ? "var(--gold)" : "#5A8A4A" }}>
                        {strength.label}
                      </div>
                    </>
                  )}
                  {errors.password && <div className="err-msg">{errors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="field">
                  <label>Confirm Password</label>
                  <div className="input-wrap">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={errors.confirmPassword ? "error" : ""}
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={set("confirmPassword")}
                    />
                    <button className="eye-btn" onClick={() => setShowConfirm(v => !v)} type="button">
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                  {errors.confirmPassword && <div className="err-msg">{errors.confirmPassword}</div>}
                </div>

                {/* Terms */}
                <div className="check-field">
                  <input type="checkbox" id="terms" checked={form.terms} onChange={set("terms")} />
                  <label htmlFor="terms">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I consent to receive marketing communications.
                    {errors.terms && <><br /><span style={{ color: "var(--rust)", fontSize: 11 }}>{errors.terms}</span></>}
                  </label>
                </div>

                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                  <span className="btn-shimmer" />
                  {loading ? "Creating your account…" : "Create Account"}
                </button>

                <div className="divider">or continue with</div>

                <div className="social-row">
                  <button className="social-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                  </button>
                  <button className="social-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
