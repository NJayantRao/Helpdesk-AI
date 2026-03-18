"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  GraduationCap,
  Shield,
  Globe,
  BarChart3,
  Send,
  Bot,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Building,
  Mic,
  MicOff,
  ChevronDown,
  MessageCircle,
  Bell,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Award,
  CheckCircle2,
  Zap,
  Star,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import axios from "axios";

/* ─── Types ─────────────────────────────────── */
interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

const getBotResponse = async (msg: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/chat`,
    { message: msg },
    { withCredentials: true }
  );
  const botReply = response?.data?.data?.output || "No response received";
  // console.log(botReply);

  return botReply;
};

const FEATURES = [
  {
    icon: Bot,
    title: "AI-Powered Helpdesk",
    desc: "24×7 multilingual support with RAG-based document retrieval and contextual answers",
    color: "indigo",
    badge: "New",
  },
  {
    icon: BarChart3,
    title: "CGPA Analytics",
    desc: "Semester-wise SGPA tracking with trend analysis: Improving, Stable, or Declining",
    color: "emerald",
    badge: null,
  },
  {
    icon: Shield,
    title: "Secure & Role-Based",
    desc: "JWT authentication with granular access control for students, admins, and staff",
    color: "amber",
    badge: null,
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    desc: "Query in your preferred language — responses adapt to your language preference",
    color: "sky",
    badge: null,
  },
  {
    icon: GraduationCap,
    title: "Academic Records",
    desc: "Complete semester results, subject-wise breakdown, and credit tracking",
    color: "purple",
    badge: null,
  },
  {
    icon: BookOpen,
    title: "Document Hub",
    desc: "Centralized notices, circulars, syllabus, and exam-related documents",
    color: "rose",
    badge: null,
  },
];
const STEPS = [
  {
    icon: Users,
    n: "01",
    title: "Register & Enrol",
    desc: "Create your secure account and access your personalised dashboard instantly.",
  },
  {
    icon: FileText,
    n: "02",
    title: "Manage Records",
    desc: "Results, hall tickets, fee receipts — every document in one place.",
  },
  {
    icon: TrendingUp,
    n: "03",
    title: "Track Progress",
    desc: "Monitor CGPA trends, attendance, and academic standing with live data.",
  },
  {
    icon: Bot,
    n: "04",
    title: "Get AI Support",
    desc: "Ask the multilingual helpdesk anything, any time of day.",
  },
];
const TESTIMONIALS = [
  {
    name: "Priya Mohanty",
    dept: "B.Tech CSE · 3rd Year",
    text: "The CGPA analytics showed me exactly which subjects needed work. Genuinely changed how I study.",
    init: "PM",
  },
  {
    name: "Rohit Das",
    dept: "B.Tech ECE · 2nd Year",
    text: "Grabbed my hall ticket at midnight from my phone. UniERP saved me from real exam-day panic.",
    init: "RD",
  },
  {
    name: "Sneha Patro",
    dept: "B.Tech ME · Final Year",
    text: "The placement portal notified me before my friends knew a company had arrived on campus.",
    init: "SP",
  },
];
const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "or", label: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "bn", label: "বাংলা", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
];
const CHIPS = [
  "How do I apply?",
  "Fee structure",
  "Placement stats",
  "CGPA calculation",
];
const iconColors: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  sky: "bg-sky-50 text-sky-600",
  purple: "bg-purple-50 text-purple-600",
  rose: "bg-rose-50 text-rose-600",
};

/* ─── Component ─────────────────────────────── */
export default function LandingPage() {
  const [msgs, setMsgs] = useState<Message[]>([
    {
      id: "0",
      role: "bot",
      content:
        "Hi! I'm the UniERP Assistant 👋 Ask me about admissions, fees, exams, hostel, or placements.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMounted, setChatMounted] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => {
    if (chatOpen) {
      setChatMounted(true);
      setHasUnread(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setChatVisible(true))
      );
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setChatVisible(false);
      const t = setTimeout(() => setChatMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [chatOpen]);

  const send = useCallback(
    async (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg) return;

      setMsgs((p) => [
        ...p,
        {
          id: String(idRef.current++),
          role: "user",
          content: msg,
        },
      ]);

      setInput("");
      setTyping(true);

      try {
        const botReply = await getBotResponse(msg);

        setTimeout(
          () => {
            setTyping(false);

            setMsgs((p) => [
              ...p,
              {
                id: String(idRef.current++),
                role: "bot",
                content: botReply || "No response received",
              },
            ]);
          },
          900 + Math.random() * 600
        );
      } catch (error) {
        setTyping(false);

        setMsgs((p) => [
          ...p,
          {
            id: String(idRef.current++),
            role: "bot",
            content: "Something went wrong.",
          },
        ]);
      }
    },
    [input]
  );

  const curLang = LANGS.find((l) => l.code === lang)!;

  return (
    <>
      {/* ── Global keyframes (only what Tailwind can't do) ── */}

      <div className="min-h-screen bg-white">
        {/* ══════════════════ NAVBAR ══════════════════ */}
        <nav
          className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 backdrop-blur-xl
          ${scrolled ? "bg-white/96 border-b border-slate-200 shadow-sm" : "bg-white/80 border-b border-transparent"}`}
        >
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-extrabold text-lg leading-none">
                  U
                </span>
              </div>
              <div>
                <div className="font-bold text-[17px] text-slate-900 leading-tight">
                  UniERP
                </div>
                <div className="text-[11px] text-slate-400 leading-none tracking-wide">
                  NIST Institute
                </div>
              </div>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                ["#features", "Features"],
                ["#how-it-works", "How It Works"],
                ["#chatbot", "Helpdesk"],
                ["#about", "About"],
              ].map(([h, l]) => (
                <a
                  key={h}
                  href={h}
                  className="text-[15px] font-medium text-slate-600 hover:text-blue-600 px-4 py-2.5 rounded-lg transition-colors duration-150"
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <button className="relative w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full border-2 border-white" />
              </button>
              <a
                href="/login?role=student"
                className="text-[14px] font-medium text-slate-700 border-[1.5px] border-slate-200 hover:border-blue-400 rounded-xl px-5 py-2.5 bg-white transition-all duration-150 hover:-translate-y-0.5"
              >
                Student Login
              </a>
              <a
                href="/login?role=admin"
                className="text-[14px] font-semibold text-white bg-indigo-600 hover:bg-blue-700 rounded-xl px-5 py-2.5 flex items-center gap-2 transition-all duration-150 hover:-translate-y-0.5 shadow-md shadow-slate-900/20"
              >
                Admin <ArrowRight size={14} />
              </a>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 px-6 pb-6">
              <div className="flex flex-col gap-0 pt-2">
                {[
                  ["#features", "Features"],
                  ["#how-it-works", "How It Works"],
                  ["#chatbot", "Helpdesk"],
                  ["#about", "About"],
                ].map(([h, l]) => (
                  <a
                    key={h}
                    href={h}
                    onClick={() => setMobileOpen(false)}
                    className="text-[15px] font-medium text-slate-600 py-3 border-b border-slate-50 hover:text-blue-600 transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <a
                  href="/login?role=student"
                  className="flex-1 text-center py-3 border border-slate-200 rounded-xl text-[14px] font-semibold text-slate-800"
                >
                  Student
                </a>
                <a
                  href="/login?role=admin"
                  className="flex-1 text-center py-3 bg-slate-900 rounded-xl text-[14px] font-semibold text-white"
                >
                  Admin
                </a>
              </div>
            </div>
          )}
        </nav>

        {/* ══════════════════ HERO ══════════════════ */}
        <section className="dot-bg pt-28 pb-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/90 to-transparent pointer-events-none" />
          <div className="max-w-3xl mx-auto px-6 relative">
            <div className="fu inline-flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-1.5 mb-8 shadow-sm shadow-blue-100">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <Sparkles size={11} color="#fff" />
              </div>
              <span className="text-[12px] font-semibold text-blue-600">
                AI-Powered University Platform · 2026
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your University,
              <br />
              <span className="text-blue-600 ">Intelligently Managed</span>
            </h1>

            <p className="fu fu2 text-[17px] text-slate-500 leading-[1.72] max-w-lg mx-auto mb-9">
              One platform for academic records, AI-powered helpdesk, document
              management, and CGPA analytics — built for modern universities.
            </p>

            <div className="fu fu3 flex flex-col sm:flex-row gap-3 justify-center flex-wrap mb-7">
              <a
                href="/login?role=student"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-blue-700 text-white text-[14px] font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-all duration-150 hover:-translate-y-0.5"
              >
                <GraduationCap size={16} /> Student Portal →
              </a>
              <a
                href="/login?role=admin"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border-[1.5px] border-slate-200 hover:border-blue-400 text-slate-900 text-[14px] font-semibold rounded-xl transition-all duration-150 hover:-translate-y-0.5"
              >
                <Building size={16} /> Admin Panel
              </a>
            </div>

            <div className="fu fu4 flex flex-wrap justify-center gap-5">
              {[
                { icon: CheckCircle2, t: "NAAC Accredited" },
                { icon: Award, t: "ISO 9001:2015" },
                { icon: Shield, t: "AICTE Approved" },
              ].map(({ icon: Icon, t }) => (
                <div
                  key={t}
                  className="flex items-center gap-1.5 text-[12px] text-slate-400 font-medium"
                >
                  <Icon size={13} className="text-emerald-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="max-w-4xl mx-auto px-6 mt-16">
            <div className="bg-white border border-slate-200 rounded-[18px] overflow-hidden shadow-sm grid grid-cols-2 md:grid-cols-4">
              {[
                ["5,000+", "Students Enrolled"],
                ["150+", "Recruiting Companies"],
                ["₹6.2 LPA", "Avg Package"],
                ["24 × 7", "AI Support"],
              ].map(([v, l], i) => (
                <div
                  key={l}
                  className={`py-6 px-4 text-center ${i < 3 ? "border-b md:border-b-0 border-r-0 md:border-r border-slate-100" : ""} ${i === 1 ? "border-r border-slate-100" : ""}`}
                >
                  <div className="serif text-[28px] font-semibold text-slate-900">
                    {v}
                  </div>
                  <div className="text-[12px] text-slate-400 mt-1 font-medium">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ ANNOUNCEMENT ══════════════════ */}
        <div className="bg-slate-900 py-3 px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-[11px] font-bold text-white">
              <Zap size={9} className="text-amber-400" /> Live
            </span>
            <span className="text-[13px] text-white/60">
              Admissions 2026–27 are open ·{" "}
              <a
                href="#"
                className="text-amber-400 font-semibold hover:text-amber-300 transition-colors"
              >
                Apply before April 30 →
              </a>
            </span>
          </div>
        </div>

        {/* ══════════════════ FEATURES ══════════════════ */}
        <section id="features" className="py-20 px-5 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-bold text-slate-900 mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Everything in One Place
              </h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                From admission to placement — UniERP handles every aspect of
                university life.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="relative bg-white border border-slate-200 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200 transition-all duration-200"
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    animationFillMode: "both",
                  }}
                >
                  {f.badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                      {f.badge}
                    </span>
                  )}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                      iconColors[f.color]
                    )}
                  >
                    <f.icon size={19} />
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

        {/* ══════════════════ HOW IT WORKS ══════════════════ */}
        <section id="how-it-works" className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="text-[11px] font-bold text-blue-600 tracking-[0.12em] uppercase mb-3">
                Process
              </div>
              <h2 className="serif text-[clamp(26px,4vw,40px)] text-slate-900">
                Get Started in Minutes
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {STEPS.map((s) => (
                <div key={s.n} className="text-center">
                  <div className="relative inline-block mb-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <s.icon size={22} className="text-blue-600" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
                      {s.n}
                    </span>
                  </div>
                  <div className="text-[14px] font-semibold text-slate-900 mb-2">
                    {s.title}
                  </div>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ CALENDAR STRIP ══════════════════ */}
        <section className="py-14 px-6 bg-slate-50 border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2.5 mb-7">
              <Calendar size={15} className="text-blue-600" />
              <span className="text-[12px] font-bold text-slate-900 uppercase tracking-wider">
                Upcoming Calendar
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[
                {
                  date: "APR 30",
                  event: "Admission Deadline 2026–27",
                  tag: "Admissions",
                  tc: "text-indigo-700",
                  bg: "bg-indigo-50",
                },
                {
                  date: "MAY 12",
                  event: "End Semester Examinations Begin",
                  tag: "Exams",
                  tc: "text-amber-700",
                  bg: "bg-amber-50",
                },
                {
                  date: "JUN 01",
                  event: "Campus Placement Drive — Phase 2",
                  tag: "Placements",
                  tc: "text-green-700",
                  bg: "bg-green-50",
                },
              ].map(({ date, event, tag, tc, bg }) => (
                <div
                  key={date}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4"
                >
                  <div
                    className={`text-center min-w-[46px] ${bg} rounded-lg py-1.5 px-1 shrink-0`}
                  >
                    <div
                      className={`text-[11px] font-extrabold ${tc} tracking-wide`}
                    >
                      {date.split(" ")[0]}
                    </div>
                    <div className={`text-[10px] ${tc} opacity-75`}>
                      {date.split(" ")[1]}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900 mb-1.5">
                      {event}
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${tc} ${bg} rounded-full px-2.5 py-0.5`}
                    >
                      {tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ TESTIMONIALS ══════════════════ */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="text-[11px] font-bold text-blue-600 tracking-[0.12em] uppercase mb-3">
                Reviews
              </div>
              <h2 className="serif text-[clamp(26px,4vw,40px)] text-slate-900">
                What Students Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-7"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="serif text-[14px] text-slate-500 leading-[1.72] italic mb-5">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {t.init}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900">
                        {t.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{t.dept}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ CTA BANNER ══════════════════ */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <div
              className="relative rounded-3xl overflow-hidden py-16 sm:py-20 px-8 sm:px-16 text-center"
              style={{
                background:
                  "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
              }}
            >
              {/* Bubble decorations */}
              {[
                { s: 200, t: -50, l: -60 },
                { s: 130, t: 20, r: 80, op: 0.05 },
                { s: 90, b: -20, l: "32%", op: 0.04 },
                { s: 240, b: -90, r: -70 },
              ].map((b, i) => (
                <div
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: b.s,
                    height: b.s,
                    top: b.t,
                    left: b.l,
                    right: b.r,
                    bottom: b.b,
                    background: "rgba(255,255,255,1)",
                    opacity: 0.06,
                  }}
                />
              ))}
              <div className="relative">
                <h2 className="serif text-[clamp(26px,4vw,44px)] text-white font-normal mb-4">
                  Ready to Transform Your
                  <br className="hidden sm:block" /> Academic Journey?
                </h2>
                <p className="text-[15px] text-white/60 max-w-md mx-auto leading-relaxed mb-10">
                  Join thousands of students who manage their entire university
                  experience from one intelligent platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                  <a
                    href="/login?role=student"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-[14px] font-bold rounded-xl shadow-xl shadow-amber-500/40 transition-all duration-150 hover:-translate-y-0.5"
                  >
                    Get Started Now →
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/18 text-white border border-white/20 text-[14px] font-semibold rounded-xl transition-all duration-150"
                  >
                    Explore Features
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ FOOTER ══════════════════ */}
        <footer id="about" className="bg-slate-900 pt-16 pb-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10 pb-12 border-b border-white/[0.07]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-extrabold text-[15px]">
                      U
                    </span>
                  </div>
                  <span className="text-[15px] font-bold text-white">
                    UniERP
                  </span>
                </div>
                <p className="text-[13px] text-white/35 leading-relaxed max-w-xs mb-6">
                  AI-powered university management with multilingual helpdesk,
                  academic analytics, and secure role-based access.
                </p>
                <div className="flex gap-2.5">
                  <a
                    href="/login?role=student"
                    className="text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-2 transition-colors"
                  >
                    Student Login
                  </a>
                  <a
                    href="/login?role=admin"
                    className="text-[12px] font-semibold text-white/50 border border-white/12 hover:border-white/25 rounded-lg px-4 py-2 transition-colors"
                  >
                    Admin Login
                  </a>
                </div>
              </div>
              {[
                {
                  head: "Platform",
                  links: [
                    ["Student Portal", "/login?role=student"],
                    ["Admin Panel", "/login?role=admin"],
                    ["AI Helpdesk", "#chatbot"],
                    ["Features", "#features"],
                  ],
                },
                {
                  head: "University",
                  links: [
                    ["About NIST", "#"],
                    ["Admissions", "#"],
                    ["Placements", "#"],
                    ["Contact Us", "#"],
                  ],
                },
              ].map(({ head, links }) => (
                <div key={head}>
                  <div className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-5">
                    {head}
                  </div>
                  <div className="flex flex-col gap-3">
                    {links.map(([label, href]) => (
                      <a
                        key={label}
                        href={href}
                        className="text-[13px] text-white/38 hover:text-white transition-colors duration-150"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6">
              <span className="text-[12px] text-white/18">
                © 2026 UniERP · NIST Institute of Science & Technology
              </span>
              <div className="flex gap-5">
                {["Privacy Policy", "Terms of Use", "Accessibility"].map(
                  (l) => (
                    <a
                      key={l}
                      href="#"
                      className="text-[12px] text-white/18 hover:text-white/50 transition-colors"
                    >
                      {l}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </footer>

        {/* ══════════════════════════════════════════════════
            CHAT WIDGET
        ══════════════════════════════════════════════════ */}
        <div id="chatbot">
          {/* Panel */}
          {chatMounted && (
            <div
              className={`chat-panel ${chatVisible ? "chat-shown" : "chat-hidden"}
              fixed bottom-[88px] right-4 sm:right-5 z-[100]
              w-[calc(100vw-32px)] sm:w-[370px]
              bg-white rounded-[22px] border border-slate-200
              flex flex-col overflow-hidden
              shadow-2xl shadow-slate-900/15`}
              style={{ maxHeight: "calc(100vh - 110px)" }}
            >
              {/* ─ Header (blue gradient) ─ */}
              <div
                className="shrink-0 px-4 pt-5 pb-0"
                style={{
                  background:
                    "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #2563eb 100%)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  {/* Orb + name */}
                  <div className="flex items-center gap-3">
                    <div
                      className="orb w-12 h-12 rounded-full shrink-0"
                      style={{
                        background:
                          "radial-gradient(circle at 32% 30%, #93c5fd 0%, #3b82f6 35%, #1d4ed8 65%, #1e1b4b 100%)",
                      }}
                    />
                    <div>
                      <div className="text-white font-bold text-[15px] leading-snug">
                        UniERP Assistant
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                        <span className="text-white/55 text-[12px]">
                          Online · Multilingual AI
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    {/* Lang picker */}
                    <div className="relative">
                      <button
                        onClick={() => setLangOpen((v) => !v)}
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all cursor-pointer"
                      >
                        <span className="text-[13px]">{curLang.flag}</span>
                        {curLang.label}
                        <ChevronDown
                          size={9}
                          className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {langOpen && (
                        <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden min-w-[140px] z-20">
                          {LANGS.map((l) => (
                            <button
                              key={l.code}
                              onClick={() => {
                                setLang(l.code);
                                setLangOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-2.5 transition-colors cursor-pointer
                                ${l.code === lang ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}
                            >
                              <span className="text-[15px]">{l.flag}</span>
                              {l.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Close */}
                    <button
                      onClick={() => setChatOpen(false)}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Quick chips */}
                <div className="chips flex gap-2 overflow-x-auto pb-4">
                  {CHIPS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="shrink-0 text-[12px] font-medium text-white/80 bg-white/10 hover:bg-white/20 border border-white/18 rounded-full px-3.5 py-1.5 whitespace-nowrap transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* ─ Messages ─ */}
              <div
                ref={bodyRef}
                className="msgs flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
                style={{ minHeight: 180, maxHeight: 300 }}
              >
                {msgs.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2 items-end ${m.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {m.role === "bot" && (
                      <div
                        className="w-7 h-7 rounded-full shrink-0 mb-0.5"
                        style={{
                          background:
                            "radial-gradient(circle at 32% 30%,#93c5fd,#1d4ed8)",
                        }}
                      />
                    )}
                    <div
                      className={`max-w-[78%] text-[13px] leading-relaxed px-3.5 py-2.5
                      ${
                        m.role === "bot"
                          ? "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm rounded-tr-2xl rounded-b-2xl"
                          : "bg-slate-900 text-white rounded-tr-sm rounded-tl-2xl rounded-b-2xl"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex gap-2 items-end">
                    <div
                      className="w-7 h-7 rounded-full shrink-0"
                      style={{
                        background:
                          "radial-gradient(circle at 32% 30%,#93c5fd,#1d4ed8)",
                      }}
                    />
                    <div className="bg-slate-50 border border-slate-100 rounded-tl-sm rounded-tr-2xl rounded-b-2xl px-4 py-3 flex gap-1 items-center">
                      <div className="d1 w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <div className="d2 w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <div className="d3 w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* ─ Input ─ */}
              <div className="px-4 pb-4 pt-2 shrink-0 border-t border-slate-100">
                <div className="flex items-center gap-2 bg-slate-50 border-[1.5px] border-slate-200 focus-within:border-blue-400 rounded-2xl px-3.5 py-2 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder="Ask anything about NIST…"
                    className="flex-1 text-[13px] text-slate-800 bg-transparent border-none outline-none placeholder-slate-400 caret-blue-600"
                  />
                  <button
                    onClick={() => setListening((v) => !v)}
                    className={`w-8 h-8 rounded-xl border-none flex items-center justify-center transition-all cursor-pointer shrink-0
                      ${listening ? "bg-red-100 text-red-500" : "bg-transparent text-slate-400 hover:text-slate-600"}`}
                  >
                    {listening ? <MicOff size={13} /> : <Mic size={13} />}
                  </button>
                  <button
                    onClick={() => send()}
                    disabled={!input.trim()}
                    className={`w-8 h-8 rounded-xl border-none flex items-center justify-center transition-all cursor-pointer shrink-0
                      ${input.trim() ? "bg-slate-900 hover:bg-blue-700 text-white" : "bg-slate-200 text-white cursor-default"}`}
                  >
                    <Send size={12} />
                  </button>
                </div>
                <p className="text-center mt-2 text-[10px] text-slate-300">
                  UniERP AI · Verify important info with staff
                </p>
              </div>
            </div>
          )}

          {/* FAB */}
          <button
            onClick={() => setChatOpen((v) => !v)}
            className={`fixed bottom-5 right-4 sm:right-5 z-[101] w-14 h-14 rounded-[18px] border-none cursor-pointer
              flex items-center justify-center
              transition-all duration-200 hover:-translate-y-1 active:scale-95
              ${
                chatOpen
                  ? "bg-slate-700 shadow-xl shadow-slate-900/30"
                  : "bg-blue-700 shadow-xl shadow-blue-800/40 hover:shadow-blue-600/50 hover:shadow-2xl"
              }`}
            aria-label="Open AI Helpdesk"
          >
            <div
              className="fab-icon absolute"
              style={{
                opacity: chatOpen ? 0 : 1,
                transform: chatOpen
                  ? "scale(.5) rotate(-70deg)"
                  : "scale(1) rotate(0deg)",
              }}
            >
              <MessageCircle size={22} color="#fff" />
            </div>
            <div
              className="fab-icon absolute"
              style={{
                opacity: chatOpen ? 1 : 0,
                transform: chatOpen
                  ? "scale(1) rotate(0deg)"
                  : "scale(.5) rotate(70deg)",
              }}
            >
              <X size={22} color="#fff" />
            </div>
            {hasUnread && !chatOpen && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                1
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
