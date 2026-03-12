<<<<<<< HEAD
"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  Shield,
  Globe,
  BarChart3,
  ChevronRight,
  Send,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Building,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

const FAQ_RESPONSES: Record<string, string> = {
  admission:
    "Admissions for 2026-27 are open! Apply online at nist.edu/admissions before April 30. We offer B.Tech in CS, ECE, ME, CE, and Chemical Engineering. Required documents: 10+2 marksheet, ID proof, passport photos.",
  cgpa: "CGPA calculation follows a credit-weighted system. Each subject has assigned credits, and your SGPA per semester feeds into the cumulative CGPA. Login to your dashboard for your live CGPA and trend analysis.",
  hostel:
    "NIST provides separate hostels for boys and girls with 24/7 security, Wi-Fi, mess facilities, and sports amenities. Apply during admission or before each academic year. Contact hostel@nist.edu for details.",
  exam: "Semester examinations are conducted at the end of each semester. Mid-semester exams happen in Week 7-8. Hall tickets are issued 2 weeks prior. Results are declared within 30 days of the last exam.",
  fee: "Tuition fee for B.Tech programs ranges from ₹85,000 – ₹1,20,000 per year based on program. Scholarships available for merit students (top 10% CGPA). Contact accounts@nist.edu for payment queries.",
  placement:
    "NIST has a dedicated Placement Cell with 150+ companies visiting annually. Average package: ₹6.2 LPA. Top recruiters include TCS, Infosys, Wipro, Cognizant, and more. Eligibility: CGPA ≥ 6.5.",
};

function getBotResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (
    lower.includes("admiss") ||
    lower.includes("apply") ||
    lower.includes("join")
  )
    return FAQ_RESPONSES.admission;
  if (
    lower.includes("cgpa") ||
    lower.includes("grade") ||
    lower.includes("marks") ||
    lower.includes("result")
  )
    return FAQ_RESPONSES.cgpa;
  if (
    lower.includes("hostel") ||
    lower.includes("accommodation") ||
    lower.includes("room")
  )
    return FAQ_RESPONSES.hostel;
  if (
    lower.includes("exam") ||
    lower.includes("test") ||
    lower.includes("hall ticket")
  )
    return FAQ_RESPONSES.exam;
  if (
    lower.includes("fee") ||
    lower.includes("payment") ||
    lower.includes("scholarship") ||
    lower.includes("cost")
  )
    return FAQ_RESPONSES.fee;
  if (
    lower.includes("placement") ||
    lower.includes("job") ||
    lower.includes("campus") ||
    lower.includes("recruit")
  )
    return FAQ_RESPONSES.placement;
  return "Thanks for your question! I can help with admissions, fees, exams, hostel, placements, and CGPA queries. Could you provide more details or try rephrasing? For urgent queries, contact info@nist.edu.";
}

const FEATURES = [
  {
    icon: Bot,
    title: "AI-Powered Helpdesk",
    desc: "24×7 multilingual support with RAG-based document retrieval and contextual answers",
    color: "indigo",
  },
  {
    icon: BarChart3,
    title: "CGPA Analytics",
    desc: "Semester-wise SGPA tracking with trend analysis: Improving, Stable, or Declining",
    color: "emerald",
  },
  {
    icon: Shield,
    title: "Secure & Role-Based",
    desc: "JWT authentication with granular access control for students, admins, and staff",
    color: "amber",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    desc: "Query in your preferred language — responses adapt to your language preference",
    color: "sky",
  },
  {
    icon: GraduationCap,
    title: "Academic Records",
    desc: "Complete semester results, subject-wise breakdown, and credit tracking",
    color: "purple",
  },
  {
    icon: BookOpen,
    title: "Document Hub",
    desc: "Centralized notices, circulars, syllabus, and exam-related documents",
    color: "rose",
  },
];

const iconColors: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  sky: "bg-sky-50 text-sky-600",
  purple: "bg-purple-50 text-purple-600",
  rose: "bg-rose-50 text-rose-600",
};

const QUICK_QUESTIONS = [
  "How do I apply for admission?",
  "What is the fee structure?",
  "Tell me about placements",
  "How is CGPA calculated?",
];

export default function LandingPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "bot",
      content:
        "👋 Hi! I'm the UniERP Assistant. Ask me about admissions, fees, exams, hostels, or placements!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text?: string) {
    const msg = (text || input).trim();
    if (!msg) return;
    const userMsg: Message = {
      id: (++messageIdRef.current).toString(),
      role: "user",
      content: msg,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (++messageIdRef.current).toString(),
          role: "bot",
          content: getBotResponse(msg),
        },
      ]);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-900">UniERP</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600 font-medium">
            <a
              href="#features"
              className="hover:text-indigo-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#chatbot"
              className="hover:text-indigo-600 transition-colors"
            >
              Helpdesk
            </a>
            <a
              href="#about"
              className="hover:text-indigo-600 transition-colors"
            >
              About
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
            >
              Get Started <ArrowRight size={14} />
            </Link>
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 px-5 py-4 space-y-2 bg-white">
            {["features", "chatbot", "about"].map((s) => (
              <a
                key={s}
                href={`#${s}`}
                className="block py-2 text-sm text-slate-600 capitalize"
                onClick={() => setMobileMenuOpen(false)}
              >
                {s}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-6 animate-fade-in">
            <Sparkles size={12} /> AI-Powered University Platform
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-5 animate-slide-up"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your University,
            <br />
            <span className="text-indigo-600">Intelligently Managed</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8 animate-slide-up delay-100">
            One platform for academic records, AI-powered helpdesk, document
            management, and CGPA analytics — built for modern universities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up delay-200">
            <Link
              href="/login?role=student"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              <GraduationCap size={16} /> Student Login
            </Link>
            <Link
              href="/login?role=admin"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 transition-all hover:-translate-y-0.5"
            >
              <Building size={16} /> Admin Login
            </Link>
          </div>
          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 animate-slide-up delay-300">
            {[
              ["5,000+", "Students"],
              ["150+", "Recruiters"],
              ["24×7", "AI Support"],
              ["10+", "Departments"],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold text-slate-900">{v}</div>
                <div className="text-xs text-slate-400 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-5 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold text-slate-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Everything in One Place
            </h2>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              From admission to placement — UniERP handles every aspect of
              university life.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={cn(
                  "bg-white border border-slate-200 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 animate-slide-up"
                )}
                style={{
                  animationDelay: `${i * 0.07}s`,
                  animationFillMode: "both",
                }}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                    iconColors[f.color]
                  )}
                >
                  <f.icon size={20} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <section id="chatbot" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-5">
                <Bot size={12} /> Live AI Chatbot
              </div>
              <h2
                className="text-3xl font-bold text-slate-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Ask Anything, Anytime
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Our AI helpdesk is powered by a Retrieval-Augmented Generation
                (RAG) pipeline, giving you accurate, document-grounded answers
                about admissions, exams, hostel, and more.
              </p>
              <div className="space-y-3">
                {[
                  "Natural language understanding in multiple languages",
                  "Grounded in official university documents",
                  "Instant answers for 50+ common queries",
                  "Available 24×7 without wait times",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <ChevronRight size={12} className="text-emerald-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            {/* Chat Widget */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    UniERP Assistant
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-indigo-200">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse-soft" />{" "}
                    Online — Ask me anything
                  </div>
                </div>
              </div>
              <div className="h-64 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex gap-2.5",
                      m.role === "user" && "justify-end"
                    )}
                  >
                    {m.role === "bot" && (
                      <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={13} className="text-indigo-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        m.role === "user"
                          ? "chat-bubble-user"
                          : "chat-bubble-ai",
                        "animate-slide-up text-xs"
                      )}
                    >
                      {m.content}
                    </div>
                    {m.role === "user" && (
                      <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <User size={13} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                      <Bot size={13} className="text-indigo-600" />
                    </div>
                    <div className="chat-bubble-ai">
                      <div className="flex gap-1 items-center py-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-typing"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              {/* Quick replies */}
              <div className="px-4 py-2 border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-none">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-[11px] whitespace-nowrap px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-slate-200 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 py-2.5 px-3.5 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button
                  onClick={() => sendMessage()}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="about"
        className="py-20 px-5 bg-gradient-to-br from-indigo-600 to-indigo-800"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to get started?
          </h2>
          <p className="text-indigo-200 mb-8 text-base">
            Join thousands of students and faculty already using UniERP for
            smarter university management.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login?role=student"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-indigo-700 bg-white rounded-xl hover:bg-indigo-50 transition-all shadow-sm"
            >
              <GraduationCap size={16} /> Student Portal
            </Link>
            <Link
              href="/login?role=admin"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all"
            >
              <Building size={16} /> Admin Portal
            </Link>
          </div>
=======
export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', sans-serif;
          background: #f7f8fc;
          color: #0f0f0f;
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(247,248,252,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e8eaf0;
          height: 64px;
          display: flex;
          align-items: center;
          padding: 0 48px;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 17px;
          font-weight: 800;
          color: #0f0f0f;
          letter-spacing: -0.5px;
        }

        .logo-icon {
          width: 30px;
          height: 30px;
          background: #0f0f0f;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-btn {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #0f0f0f;
          background: white;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          padding: 9px 22px;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: -0.1px;
        }

        .login-btn:hover {
          border-color: #0f0f0f;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .hero {
          min-height: calc(100vh - 64px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 24px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 100px;
          padding: 6px 16px;
          margin-bottom: 40px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          background: #f59e0b;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .badge-text {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .hero-heading {
          font-size: 68px;
          font-weight: 800;
          line-height: 1.06;
          letter-spacing: -3px;
          color: #0f0f0f;
          margin-bottom: 24px;
          max-width: 760px;
        }

        .hero-heading .accent {
          color: #2563eb;
        }

        .hero-sub {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.65;
          letter-spacing: -0.2px;
          margin-bottom: 52px;
          max-width: 460px;
        }

        .hero-pills {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pill {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 100px;
          padding: 7px 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .pill-divider {
          color: #d1d5db;
          font-size: 16px;
        }

        footer {
          border-top: 1px solid #e8eaf0;
          padding: 22px 48px;
          text-align: center;
        }

        footer p {
          font-size: 13px;
          color: #b0b7c3;
          letter-spacing: -0.1px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .navbar { padding: 0 20px; }
          .hero-heading { font-size: 40px; letter-spacing: -1.8px; }
          .hero-sub { font-size: 16px; }
          footer { padding: 22px 20px; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.2" fill="white" />
              <rect
                x="8"
                y="1"
                width="5"
                height="5"
                rx="1.2"
                fill="white"
                fillOpacity="0.45"
              />
              <rect
                x="1"
                y="8"
                width="5"
                height="5"
                rx="1.2"
                fill="white"
                fillOpacity="0.45"
              />
              <rect x="8" y="8" width="5" height="5" rx="1.2" fill="white" />
            </svg>
          </div>
          NIS
        </div>
        <button className="login-btn">Login</button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="badge">
          <span className="badge-dot" />
          <span className="badge-text">Under Development</span>
        </div>

        <h1 className="hero-heading">
          <span className="accent">AI-Powered</span> Intelligent
          <br />
          University ERP
        </h1>

        <p className="hero-sub">
          A smarter academic system is under development.
        </p>

        <div className="hero-pills">
          <span className="pill">RAG-Based Helpdesk</span>
          <span className="pill-divider">·</span>
          <span className="pill">Multilingual AI</span>
          <span className="pill-divider">·</span>
          <span className="pill">Academic Intelligence</span>
>>>>>>> 8461caf (hotfix: restore codebase after accidental PR merge changes)
        </div>
      </section>

      {/* Footer */}
<<<<<<< HEAD
      <footer className="bg-slate-900 px-5 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">UniERP</span>
            <span className="text-slate-500 text-xs">
              · AI-Powered University Platform
            </span>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Contact
            </a>
          </div>
          <div className="text-xs text-slate-600">
            © 2026 UniERP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
=======
      <footer>
        <p>Built for modern academic systems</p>
      </footer>
    </>
>>>>>>> 8461caf (hotfix: restore codebase after accidental PR merge changes)
  );
}
