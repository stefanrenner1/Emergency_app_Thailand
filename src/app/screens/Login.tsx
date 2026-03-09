import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { HelpModal } from "../components/HelpModal";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim() || !password) {
      setError(t("loginErrorFillAll"));
      setLoading(false);
      return;
    }

    const { error: authError } = await signIn(email.trim(), password);

    if (authError) {
      setError(authError.message || t("loginErrorGeneric"));
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header title={t("loginTitle")} />
      <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-5">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
            <Mail className="w-4 h-4" />
            {t("email")} <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors bg-white"
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
            <Lock className="w-4 h-4" />
            {t("password")} <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors bg-white"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-900 dark:border-[var(--foreground)] hover:border-gray-700 dark:hover:border-[var(--muted-foreground)] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-semibold"
        >
          {loading ? t("loggingIn") : t("login")}
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
          {t("noAccount")}{" "}
          <Link to="/register" className="font-semibold text-gray-900 dark:text-[var(--foreground)] underline">
            {t("register")}
          </Link>
        </p>
      </form>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
