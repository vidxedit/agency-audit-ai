"use client";
import { useState, useEffect } from "react";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const COLORS = {
  bg: "#0a0c10", surface: "#111318", surfaceAlt: "#161a22",
  border: "#1e2330", borderBright: "#2a3245", accent: "#4f8ef7",
  accentGlow: "#4f8ef730", accentDim: "#3a6bc4", green: "#22d3a0",
  orange: "#f97316", red: "#f43f5e", muted: "#4a5568",
  text: "#e2e8f0", textDim: "#8899aa",
};
const SCORE_COLOR = (s: number) =>
  s >= 85 ? COLORS.green : s >= 50 ? COLORS.orange : COLORS.red;

const injectStyles = () => {
  if (document.getElementById("aa-styles")) return;
  const el = document.createElement("style");
  el.id = "aa-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #0a0c10; color: #e2e8f0; font-family: 'DM Sans', sans-serif; }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    @keyframes scoreCount { from { opacity:0; transform:scale(.6); } to { opacity:1; transform:scale(1); } }
    @keyframes glow { 0%,100% { box-shadow: 0 0 20px #4f8ef730; } 50% { box-shadow: 0 0 40px #4f8ef744; } }
    @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
    .fade-up { animation: fadeUp .6s ease both; }
    .fade-up-1 { animation: fadeUp .6s .1s ease both; }
    .fade-up-2 { animation: fadeUp .6s .2s ease both; }
    .fade-up-3 { animation: fadeUp .6s .3s ease both; }
    .fade-up-4 { animation: fadeUp .6s .4s ease both; }
    .score-ring { animation: scoreCount .8s .3s cubic-bezier(.34,1.56,.64,1) both; }
    .btn-primary { background: #4f8ef7; color: #fff; border: none; padding: 14px 28px; border-radius: 10px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; transition: all .2s; letter-spacing: .02em; animation: glow 3s ease infinite; }
    .btn-primary:hover { background: #3a6bc4; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; animation: none; }
    .btn-ghost { background: transparent; color: #8899aa; border: 1px solid #1e2330; padding: 10px 20px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all .2s; }
    .btn-ghost:hover { border-color: #4f8ef7; color: #4f8ef7; background: #4f8ef730; }
    .card { background: #111318; border: 1px solid #1e2330; border-radius: 16px; padding: 24px; transition: border-color .2s; }
    .card:hover { border-color: #2a3245; }
    .tag { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; font-family: 'Syne', sans-serif; }
    .input-url { width: 100%; background: #161a22; border: 1.5px solid #1e2330; color: #e2e8f0; padding: 16px 20px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 16px; outline: none; transition: border-color .2s, box-shadow .2s; }
    .input-url:focus { border-color: #4f8ef7; box-shadow: 0 0 0 3px #4f8ef730; }
    .input-url::placeholder { color: #4a5568; }
    .progress-bar { height: 4px; background: #1e2330; border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0a0c10; }
    ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 3px; }
    .grid-bg { background-image: linear-gradient(#1e233022 1px, transparent 1px), linear-gradient(90deg, #1e233022 1px, transparent 1px); background-size: 40px 40px; }
    .tab-btn { padding: 10px 20px; border-radius: 8px; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px; cursor: pointer; border: 1px solid transparent; transition: all .2s; letter-spacing: .02em; }
    .tab-btn.active { background: #4f8ef730; border-color: #4f8ef755; color: #4f8ef7; }
    .tab-btn:not(.active) { background: transparent; color: #8899aa; }
    .tab-btn:not(.active):hover { color: #e2e8f0; background: #161a22; }
  `;
  document.head.appendChild(el);
};
type IconProps = { size?: number; stroke?: string; fill?: string; strokeWidth?: number };
const Icon = ({ d, size = 20, stroke = COLORS.textDim, fill = "none", strokeWidth = 1.8 }: IconProps & { d: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);
const Icons = {
  Gauge:     (p: IconProps) => <Icon {...p} d={<><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12 2 12"/><circle cx="12" cy="12" r="1"/></>} />,
  FileText:  (p: IconProps) => <Icon {...p} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> } />,
  Brain:     (p: IconProps) => <Icon {...p} d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.96-3.18A2.5 2.5 0 0 1 9.5 2M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.96-3.18A2.5 2.5 0 0 0 14.5 2" />,
  TrendingUp:(p: IconProps) => <Icon {...p} d={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} />,
  Check:     (p: IconProps) => <Icon {...p} d="M20 6L9 17l-5-5" />,
  X:         (p: IconProps) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />,
  Alert:     (p: IconProps) => <Icon {...p} d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />,
  Globe:     (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>} />,
  Refresh:   (p: IconProps) => <Icon {...p} d={<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>} />,
  Copy:      (p: IconProps) => <Icon {...p} d={<><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>} />,
  Sparkles:  (p: IconProps) => <Icon {...p} d={<><path d="M12 3l1.09 4.26a4 4 0 0 0 2.65 2.65L20 11l-4.26 1.09a4 4 0 0 0-2.65 2.65L12 19l-1.09-4.26a4 4 0 0 0-2.65-2.65L4 13l4.26-1.09a4 4 0 0 0 2.65-2.65L12 3z"/><path d="M5 3l.5 2a2 2 0 0 0 1.5 1.5L9 7l-2 .5A2 2 0 0 0 5.5 9L5 11l-.5-2A2 2 0 0 0 3 7.5L1 7l2-.5A2 2 0 0 0 4.5 5L5 3z"/></>} />,
  Shield:    (p: IconProps) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
};
interface PageSpeedMetrics { lcp: number; fcp: number; cls: number; ttfb: number; tbt: number; fid: number; }
interface PageSpeedIssue { type: "error" | "warn" | "pass"; text: string; }
interface PageSpeedResult { performance: number; accessibility: number; bestPractices: number; seo: number; metrics: PageSpeedMetrics; issues: PageSpeedIssue[]; }
interface AuditData { ps: PageSpeedResult; copyAudit: string; actionPlan: string; }

function ScoreRing({ score, size = 120, label, sublabel }: { score: number; size?: number; label?: string; sublabel?: string }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = SCORE_COLOR(score);
  return (
    <div className="score-ring" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={COLORS.border} strokeWidth={8} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 8px ${color}88)` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: size * 0.28, color }}>{score}</span>
          {sublabel && <span style={{ fontSize: 10, color: COLORS.muted, marginTop: 2 }}>{sublabel}</span>}
        </div>
      </div>
      {label && <span style={{ fontSize: 13, color: COLORS.textDim, fontWeight: 500 }}>{label}</span>}
    </div>
  );
}

function MetricBar({ label, value, unit = "", max = 100, note }: { label: string; value: number; unit?: string; max?: number; note?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 75 ? COLORS.green : pct >= 40 ? COLORS.orange : COLORS.red;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: COLORS.text }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color, fontFamily: "'Syne', sans-serif" }}>{value}{unit}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      {note && <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{note}</p>}
    </div>
  );
}

function IssueItem({ type, text }: { type: string; text: string }) {
  const cfg = {
    error: { icon: Icons.X,     color: COLORS.red,    bg: `${COLORS.red}15`,    label: "Critical" },
    warn:  { icon: Icons.Alert, color: COLORS.orange,  bg: `${COLORS.orange}15`, label: "Warning"  },
    pass:  { icon: Icons.Check, color: COLORS.green,   bg: `${COLORS.green}15`,  label: "Passed"   },
  }[type] ?? { icon: Icons.Alert, color: COLORS.muted, bg: `${COLORS.muted}15`, label: "Info" };
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 16px", background: cfg.bg, borderRadius: 10, marginBottom: 8, border: `1px solid ${cfg.color}20` }}>
      <cfg.icon size={16} stroke={cfg.color} />
      <span style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5, flex: 1 }}>{text}</span>
      <span className="tag" style={{ background: `${cfg.color}20`, color: cfg.color, flexShrink: 0 }}>{cfg.label}</span>
    </div>
  );
}

function AIText({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div style={{ lineHeight: 1.8, color: COLORS.text }}>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: COLORS.accent, margin: "20px 0 8px" }}>{line.slice(3)}</h3>;
        if (line.startsWith("### ")) return <h4 key={i} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15, color: COLORS.text, margin: "16px 0 6px" }}>{line.slice(4)}</h4>;
        if (line.startsWith("- ") || line.startsWith("• ")) return (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, paddingLeft: 4 }}>
            <span style={{ color: COLORS.accent, marginTop: 7, flexShrink: 0 }}>▸</span>
            <span style={{ fontSize: 14, color: COLORS.textDim }}>{line.slice(2)}</span>
          </div>
        );
        if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
        return <p key={i} style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 6 }}>{line}</p>;
      })}
    </div>
  );
}
function LandingPage({ onAnalyze }: { onAnalyze: (url: string) => void }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Please enter a website URL."); return; }
    let formatted = trimmed;
    if (!/^https?:\/\//i.test(formatted)) formatted = "https://" + formatted;
    try { new URL(formatted); } catch { setError("Please enter a valid URL."); return; }
    setError("");
    onAnalyze(formatted);
  };
  const features = [
    { icon: Icons.Gauge,    title: "Core Web Vitals",  desc: "Real PageSpeed data including LCP, CLS, FID, FCP and full Lighthouse scores.", color: COLORS.accent },
    { icon: Icons.Brain,    title: "AI Copy Audit",    desc: "Claude AI analyzes headlines, CTAs, value props and conversion bottlenecks.",   color: COLORS.green  },
    { icon: Icons.FileText, title: "Pitch Generator",  desc: "Export a polished pitch your sales team can send to prospects immediately.",     color: COLORS.orange },
  ];
  const stats = [
    { value: "3 min", label: "Full audit time"   },
    { value: "12+",   label: "Audit dimensions"  },
    { value: "AI",    label: "Powered insights"  },
    { value: "∞",     label: "Clients auditable" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg }}>
      <nav style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.Sparkles size={16} stroke="#fff" />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: COLORS.text }}>
            AgencyAudit<span style={{ color: COLORS.accent }}>AI</span>
          </span>
        </div>
        <span className="tag" style={{ background: `${COLORS.green}20`, color: COLORS.green, fontSize: 11 }}>BETA · Free</span>
      </nav>
      <div className="grid-bg" style={{ padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 300, background: `radial-gradient(ellipse, ${COLORS.accent}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="fade-up">
          <span className="tag" style={{ background: `${COLORS.accent}20`, color: COLORS.accent, marginBottom: 20, display: "inline-block" }}>BUILT FOR MARKETING AGENCIES</span>
        </div>
        <h1 className="fade-up-1" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.05, marginBottom: 20, letterSpacing: "-.02em" }}>
          Audit Any Website.<br /><span style={{ color: COLORS.accent }}>Close More Clients.</span>
        </h1>
        <p className="fade-up-2" style={{ fontSize: "clamp(15px, 2vw, 18px)", color: COLORS.textDim, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Enter a prospect's URL. Get a full technical, SEO, and AI-powered conversion audit in under 3 minutes — plus a ready-to-send pitch deck.
        </p>
        <div className="fade-up-3" style={{ maxWidth: 600, margin: "0 auto", display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}>
              <Icons.Globe size={18} stroke={COLORS.muted} />
            </span>
            <input className="input-url" style={{ paddingLeft: 46 }} placeholder="https://client-website.com" value={url} onChange={(e) => { setUrl(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          <button className="btn-primary" onClick={handleSubmit} style={{ whiteSpace: "nowrap" }}>Audit Now →</button>
        </div>
        {error && <p style={{ color: COLORS.red, fontSize: 13, marginTop: 10 }}>{error}</p>}
        <div className="fade-up-4" style={{ display: "flex", justifyContent: "center", gap: "clamp(20px, 5vw, 60px)", marginTop: 50, flexWrap: "wrap" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: COLORS.accent }}>{s.value}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2, letterSpacing: ".05em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="card fade-up" style={{ animationDelay: `${i * 0.1}s`, borderTop: `3px solid ${f.color}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <f.icon size={22} stroke={f.color} />
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: COLORS.textDim, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function LoadingScreen({ url, step }: { url: string; step: number }) {
  const steps = [
    { label: "Fetching PageSpeed data",  icon: Icons.Gauge    },
    { label: "Running AI copy analysis", icon: Icons.Brain    },
    { label: "Generating action plan",   icon: Icons.Sparkles },
    { label: "Compiling audit report",   icon: Icons.FileText },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg, padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: `${COLORS.accent}20`, border: `2px solid ${COLORS.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", animation: "float 2s ease-in-out infinite" }}>
          <Icons.Sparkles size={32} stroke={COLORS.accent} />
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>Auditing Website</h2>
        <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 40, wordBreak: "break-all" }}>{url}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {steps.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: done ? `${COLORS.green}10` : active ? `${COLORS.accent}10` : COLORS.surface, borderRadius: 10, border: `1px solid ${done ? COLORS.green + "30" : active ? COLORS.accent + "30" : COLORS.border}`, transition: "all .4s" }}>
                {done
                  ? <Icons.Check size={18} stroke={COLORS.green} />
                  : active
                    ? <div style={{ width: 18, height: 18, border: `2px solid ${COLORS.accent}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite", flexShrink: 0 }} />
                    : <s.icon size={18} stroke={COLORS.muted} />
                }
                <span style={{ fontSize: 14, color: done ? COLORS.green : active ? COLORS.text : COLORS.muted }}>{s.label}</span>
              </div>
            );
          })}
        </div>
        <div className="progress-bar" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: `${(step / steps.length) * 100}%`, background: `linear-gradient(90deg, ${COLORS.accentDim}, ${COLORS.accent})` }} />
        </div>
        <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 10 }}>This may take 30–60 seconds…</p>
      </div>
    </div>
  );
}
function ReportPage({ url, data, onReset }: { url: string; data: AuditData; onReset: () => void }) {
  const [tab, setTab] = useState<"speed" | "copy" | "plan">("speed");
  const [copied, setCopied] = useState(false);
  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();
  const overallScore = Math.round((data.ps.performance + data.ps.accessibility + data.ps.seo + data.ps.bestPractices) / 4);
  const copyReport = () => {
    const text = [`AgencyAudit AI Report — ${domain}`, ``, `Performance: ${data.ps.performance}/100`, `Accessibility: ${data.ps.accessibility}/100`, `SEO: ${data.ps.seo}/100`, `Best Practices: ${data.ps.bestPractices}/100`, ``, `--- COPY AUDIT ---`, data.copyAudit, ``, `--- ACTION PLAN ---`, data.actionPlan].join("\n");
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  const tabs = [
    { id: "speed" as const, label: "⚡ Speed & Tech" },
    { id: "copy"  as const, label: "✍️ Copy Audit"   },
    { id: "plan"  as const, label: "🚀 Action Plan"  },
  ];
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg }}>
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, background: COLORS.surface, padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icons.Sparkles size={16} stroke="#fff" />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17 }}>AgencyAudit<span style={{ color: COLORS.accent }}>AI</span></span>
            <span style={{ color: COLORS.border, fontSize: 20 }}>|</span>
            <Icons.Globe size={14} stroke={COLORS.muted} />
            <span style={{ fontSize: 13, color: COLORS.textDim }}>{domain}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={copyReport} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 14px" }}>
              <Icons.Copy size={14} stroke="currentColor" />{copied ? "Copied!" : "Copy"}
            </button>
            <button className="btn-ghost" onClick={onReset} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "8px 14px" }}>
              <Icons.Refresh size={14} stroke="currentColor" />New Audit
            </button>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div className="card fade-up" style={{ marginBottom: 24, background: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.surfaceAlt} 100%)`, borderColor: COLORS.borderBright, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <ScoreRing score={overallScore} size={120} label="Overall Score" sublabel="/100" />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="tag" style={{ background: `${SCORE_COLOR(overallScore)}20`, color: SCORE_COLOR(overallScore) }}>
                {overallScore >= 85 ? "EXCELLENT" : overallScore >= 60 ? "NEEDS WORK" : "CRITICAL ISSUES"}
              </span>
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(18px, 3vw, 26px)", marginBottom: 6 }}>{domain}</h1>
            <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.6 }}>Audit completed · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              {[{ l: "Performance", v: data.ps.performance }, { l: "Accessibility", v: data.ps.accessibility }, { l: "SEO", v: data.ps.seo }, { l: "Best Practices", v: data.ps.bestPractices }].map((m) => (
                <div key={m.l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, color: SCORE_COLOR(m.v) }}>{m.v}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        {tab === "speed" && (
          <div className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              <div className="card">
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icons.Gauge size={16} stroke={COLORS.accent} /> Lighthouse Scores
                </h3>
                <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 16 }}>
                  <ScoreRing score={data.ps.performance}   size={90} label="Performance"    />
                  <ScoreRing score={data.ps.accessibility} size={90} label="Accessibility"  />
                  <ScoreRing score={data.ps.seo}           size={90} label="SEO"            />
                  <ScoreRing score={data.ps.bestPractices} size={90} label="Best Practices" />
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icons.TrendingUp size={16} stroke={COLORS.accent} /> Core Web Vitals
                </h3>
                <MetricBar label="LCP (Largest Contentful Paint)" value={data.ps.metrics.lcp}  unit="s"  max={4}    note={data.ps.metrics.lcp  <= 2.5 ? "✓ Good" : data.ps.metrics.lcp <= 4 ? "⚠ Needs improvement" : "✗ Poor"} />
                <MetricBar label="FCP (First Contentful Paint)"   value={data.ps.metrics.fcp}  unit="s"  max={4}    note={data.ps.metrics.fcp  <= 1.8 ? "✓ Good" : "⚠ Can be improved"} />
                <MetricBar label="CLS (Cumulative Layout Shift)"  value={data.ps.metrics.cls}  unit=""   max={0.5}  note={data.ps.metrics.cls  <= 0.1 ? "✓ Stable" : "⚠ Layout shifting detected"} />
                <MetricBar label="TTFB (Time to First Byte)"      value={data.ps.metrics.ttfb} unit="ms" max={1000} note={data.ps.metrics.ttfb <= 200 ? "✓ Fast server" : "⚠ Server response slow"} />
                <MetricBar label="TBT (Total Blocking Time)"      value={data.ps.metrics.tbt}  unit="ms" max={600}  note={data.ps.metrics.tbt  <= 150 ? "✓ Low blocking" : "⚠ Main thread congestion"} />
              </div>
              <div className="card" style={{ gridColumn: "1 / -1" }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icons.Shield size={16} stroke={COLORS.accent} /> Detected Issues
                </h3>
                {data.ps.issues.map((issue, i) => <IssueItem key={i} type={issue.type} text={issue.text} />)}
              </div>
            </div>
          </div>
        )}
        {tab === "copy" && (
          <div className="fade-up">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${COLORS.green}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icons.Brain size={18} stroke={COLORS.green} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>AI Copywriting & Conversion Audit</h3>
                  <p style={{ fontSize: 12, color: COLORS.muted }}>Powered by Claude AI</p>
                </div>
                <span className="tag" style={{ marginLeft: "auto", background: `${COLORS.green}15`, color: COLORS.green }}>AI Analysis</span>
              </div>
              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20 }}>
                <AIText text={data.copyAudit} />
              </div>
            </div>
          </div>
        )}
        {tab === "plan" && (
          <div className="fade-up">
            <div className="card" style={{ borderColor: `${COLORS.accent}30`, background: `linear-gradient(135deg, ${COLORS.surface} 0%, ${COLORS.accent}08 100%)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${COLORS.accent}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icons.Sparkles size={18} stroke={COLORS.accent} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>AI-Generated Agency Pitch</h3>
                  <p style={{ fontSize: 12, color: COLORS.muted }}>Ready to send to your client</p>
                </div>
                <button className="btn-ghost" onClick={copyReport} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "7px 14px" }}>
                  <Icons.Copy size={13} stroke="currentColor" />{copied ? "Copied!" : "Copy Pitch"}
                </button>
              </div>
              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20 }}>
                <AIText text={data.actionPlan} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default function App() {
  const [view,       setView]       = useState<"landing" | "loading" | "report">("landing");
  const [auditUrl,   setAuditUrl]   = useState("");
  const [loadStep,   setLoadStep]   = useState(0);
  const [reportData, setReportData] = useState<AuditData | null>(null);
  const [error,      setError]      = useState("");

  useEffect(() => { injectStyles(); }, []);

  const runAudit = async (url: string) => {
    setAuditUrl(url);
    setView("loading");
    setLoadStep(0);
    setError("");
    try {
      await sleep(400);
      setLoadStep(1);
      const fetchPromise = fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      await sleep(4000);
      setLoadStep(2);
      await sleep(4000);
      setLoadStep(3);
      const res = await fetchPromise;
      if (!res.ok) {
        let msg = `Server error ${res.status}`;
        try { const errJson = await res.json(); if (errJson?.error) msg = errJson.error; } catch {}
        throw new Error(msg);
      }
      const data: AuditData = await res.json();
      if (!data?.ps || !data?.copyAudit || !data?.actionPlan) throw new Error("Incomplete response from audit server.");
      setLoadStep(4);
      await sleep(300);
      setReportData(data);
      setView("report");
    } catch (err) {
      console.error("[AgencyAudit] runAudit error:", err);
      const message = err instanceof Error ? err.message : "Unknown error. Please try again.";
      setError(`Audit failed: ${message}`);
      setView("landing");
    }
  };

  if (view === "loading") return <LoadingScreen url={auditUrl} step={loadStep} />;
  if (view === "report" && reportData) return <ReportPage url={auditUrl} data={reportData} onReset={() => setView("landing")} />;

  return (
    <>
      {error && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999, background: `${COLORS.red}20`, border: `1px solid ${COLORS.red}40`, color: COLORS.red, padding: "12px 20px", borderRadius: 10, fontSize: 14, maxWidth: 480, textAlign: "center" }}>
          {error}
        </div>
      )}
      <LandingPage onAnalyze={runAudit} />
    </>
  );
}
