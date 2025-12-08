"use client";

import { useState } from "react";
import { Github, Linkedin, Mail, Youtube, Facebook, Instagram, Video, Send, Sparkles, MessageCircle, Lightbulb } from "lucide-react";
import Link from "next/link";

// Custom X (Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className || "w-5 h-5"} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════
// NEWSLETTER SECTION
// ═══════════════════════════════════════════════════════════

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 p-6 sm:p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
      
      <div className="relative space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-primary">Join the journey</span>
        </div>
        
        <h3 className="text-2xl font-bold">
          Get weekly insights from my Build in Public journey
        </h3>
        
        <p className="text-gray-400 text-sm">
          Lessons learned, mistakes made, wins celebrated. No spam, just real talk from a 16yo building in public.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success" || !email}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {status === "loading" ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : status === "success" ? (
              <>
                <span>✓</span>
                <span>Subscribed!</span>
              </>
            ) : status === "error" ? (
              <>
                <span>✕</span>
                <span>Try again</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </form>

        {/* Status message */}
        {message && (
          <p className={`text-sm ${status === "error" ? "text-red-400" : "text-green-400"}`}>
            {message}
          </p>
        )}

        <p className="text-xs text-gray-500">
          🔒 No spam ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONNECT OPTIONS
// ═══════════════════════════════════════════════════════════

interface ConnectOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  url: string;
  highlight?: boolean;
}

function ConnectCard({ option, onClick }: { option: ConnectOption; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl border text-left transition-all hover:scale-[1.02]
        ${option.highlight 
          ? "border-primary/50 bg-primary/5 hover:bg-primary/10" 
          : "border-white/10 bg-white/5 hover:bg-white/10"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${option.highlight ? "bg-primary/20 text-primary" : "bg-white/10 text-gray-400"}`}>
          {option.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white">{option.title}</h4>
          <p className="text-sm text-gray-400 mt-0.5">{option.description}</p>
          <span className={`text-sm font-medium mt-2 inline-block ${option.highlight ? "text-primary" : "text-gray-300"}`}>
            {option.action} →
          </span>
        </div>
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN CONTACT SECTION
// ═══════════════════════════════════════════════════════════

export function Contact({ data }: { data: Record<string, string> }) {
  const handleChange = (url: string) => {
    window.open(url, "_blank");
  };

  const connectOptions: ConnectOption[] = [
    {
      icon: <XIcon className="w-5 h-5" />,
      title: "Follow on X",
      description: "Daily thoughts, progress updates, and real-time learnings",
      action: "Let's connect",
      url: data.X,
      highlight: true,
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "DM me",
      description: "Got questions? Ideas? Just want to say hi?",
      action: "Send a message",
      url: data.X,
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Collaborate",
      description: "Building something cool? Let's build together",
      action: "Pitch your idea",
      url: data.EMAIL,
    },
  ];

  return (
    <section className="py-16 space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold">Let's Build Together</h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Whether you want to follow my journey, collaborate on a project, or just chat about tech and business.
        </p>
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* Connect Options */}
      <div className="grid sm:grid-cols-3 gap-4">
        {connectOptions.map((option) => (
          <ConnectCard
            key={option.title}
            option={option}
            onClick={() => handleChange(option.url)}
          />
        ))}
      </div>

      {/* Social Links */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-500">Or find me on other platforms</p>
        <div className="flex justify-center items-center gap-4">
          {[
            { icon: <Mail className="w-5 h-5" />, url: data.EMAIL },
            { icon: <Github className="w-5 h-5" />, url: data.GITHUB },
            { icon: <Linkedin className="w-5 h-5" />, url: data.LINKEDIN },
            { icon: <Youtube className="w-5 h-5" />, url: data.YOUTUBE },
            { icon: <Facebook className="w-5 h-5" />, url: data.FACEBOOK },
            { icon: <Instagram className="w-5 h-5" />, url: data.INSTAGRAM },
            { icon: <Video className="w-5 h-5" />, url: data.TIKTOK },
          ].map((social, index) => (
            <Link
              key={index}
              href="#"
              onClick={() => handleChange(social.url)}
              className="p-2 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all"
            >
              {social.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pt-4">
        <p className="text-gray-500 text-sm">
          ⚡ Usually respond within 24 hours
        </p>
      </div>
    </section>
  );
}
