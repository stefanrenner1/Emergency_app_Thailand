import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { HelpModal } from "../components/HelpModal";
import { Mail, Lock } from "lucide-react";

const REGISTRATION_CONSENT_KEY = "emergency_app_registration_consent";

export default function Register() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { signUp } = useAuth();
  const [showHelp, setShowHelp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptDisclaimer, setAcceptDisclaimer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email.trim() || !password || !passwordConfirm) {
      setError(t("registerErrorFillAll"));
      setLoading(false);
      return;
    }

    if (!acceptPrivacy || !acceptDisclaimer) {
      setError(language === "en" ? "You must accept both the Privacy Policy and the Disclaimer." : "คุณต้องยอมรับทั้งนโยบายความเป็นส่วนตัวและข้อจำกัดความรับผิดชอบ");
      setLoading(false);
      return;
    }

    if (password !== passwordConfirm) {
      setError(t("registerErrorPasswordMismatch"));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t("registerErrorPasswordShort"));
      setLoading(false);
      return;
    }

    const { error: authError } = await signUp(email.trim(), password);

    if (authError) {
      setError(authError.message || t("registerErrorGeneric"));
      setLoading(false);
      return;
    }

    // Store consent for profile save (timestamps)
    localStorage.setItem(REGISTRATION_CONSENT_KEY, JSON.stringify({
      privacyPolicyAcceptedAt: new Date().toISOString(),
      disclaimerAcceptedAt: new Date().toISOString(),
    }));

    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/profile", { replace: true }), 800);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
        <Header title={t("registerTitle")} />
        <div className="flex-1 px-6 py-12 flex flex-col items-center justify-center">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 rounded-xl text-center">
            <p className="text-green-800 dark:text-green-300 font-medium">{t("registerSuccess")}</p>
            <p className="text-green-700 dark:text-green-400 text-sm mt-2">{t("registerRedirect")}</p>
          </div>
        </div>
        <BottomNav onHelpClick={() => setShowHelp(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header title={t("registerTitle")} />
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
            autoComplete="new-password"
            required
            minLength={6}
          />
          <p className="text-xs text-gray-500 dark:text-[var(--muted-foreground)]">{t("passwordMinLength")}</p>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
            <Lock className="w-4 h-4" />
            {t("passwordConfirm")} <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors bg-white"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
        </div>

        {/* Required consent checkboxes - orange background, clickable links */}
        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors">
            <input
              type="checkbox"
              checked={acceptPrivacy}
              onChange={(e) => setAcceptPrivacy(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-800 dark:text-[var(--foreground)] flex-1">
              {language === "en" ? (
                <>I accept the <Link to="/privacy" onClick={(e) => e.stopPropagation()} className="font-semibold text-orange-600 underline hover:text-orange-700 inline-flex items-center gap-1">Privacy Policy</Link> and consent to data processing (PDPA).</>
              ) : (
                <>ฉันยอมรับ<Link to="/privacy" onClick={(e) => e.stopPropagation()} className="font-semibold text-orange-600 underline hover:text-orange-700 inline-flex items-center gap-1">นโยบายความเป็นส่วนตัว</Link>และยินยอมให้ประมวลผลข้อมูล (PDPA)</>
              )}
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors">
            <input
              type="checkbox"
              checked={acceptDisclaimer}
              onChange={(e) => setAcceptDisclaimer(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-800 dark:text-[var(--foreground)] flex-1">
              {language === "en" ? (
                <>I understand that this app <strong>does not replace</strong> professional medical or emergency services. <Link to="/disclaimer" onClick={(e) => e.stopPropagation()} className="font-semibold text-orange-600 underline hover:text-orange-700 inline-flex items-center gap-1">Read full disclaimer</Link></>
              ) : (
                <>ฉันเข้าใจว่าแอปนี้<strong>ไม่สามารถแทนที่</strong>บริการทางการแพทย์หรือฉุกเฉินมืออาชีพ <Link to="/disclaimer" onClick={(e) => e.stopPropagation()} className="font-semibold text-orange-600 underline hover:text-orange-700 inline-flex items-center gap-1">อ่านข้อจำกัดความรับผิดชอบ</Link></>
              )}
            </span>
          </label>
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
          {loading ? t("registering") : t("register")}
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
          {t("hasAccount")}{" "}
          <Link to="/login" className="font-semibold text-gray-900 dark:text-[var(--foreground)] underline">
            {t("login")}
          </Link>
        </p>
      </form>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
