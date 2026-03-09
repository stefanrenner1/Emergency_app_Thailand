import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { HelpModal } from '../components/HelpModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { User, Globe, Calendar, Phone, Heart, CreditCard } from 'lucide-react';
import { loadUserProfile, saveUserProfile } from '../../../utils/supabase/profile';

export default function Profile() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { setProfile: setProfileContext } = useProfile();
  const [showHelp, setShowHelp] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    insuranceNumber: '',
    nationality: '',
    dateOfBirth: '',
    contactName: '',
    contactPhone: '',
    medicalNotes: '',
  });

  useEffect(() => {
    // Use auth user ID when logged in, otherwise fallback to localStorage for guest mode
    if (user?.id) {
      setUserId(user.id);
      // Don't load from localStorage here – wait for Supabase load in next useEffect
    } else {
      let id = localStorage.getItem('userId');
      if (!id) {
        if ('randomUUID' in crypto) {
          id = crypto.randomUUID();
        } else {
          id = `user_${Date.now()}`;
        }
        localStorage.setItem('userId', id);
      }
      setUserId(id);
      const profileData = localStorage.getItem('userProfile');
      if (profileData) {
        setFormData(JSON.parse(profileData));
      }
    }
  }, [user?.id]);

  useEffect(() => {
    // When logged in, load profile from Supabase (persists across logins)
    const maybeLoadRemoteProfile = async () => {
      if (!user?.id || !userId) return;
      if (userId !== user.id) return; // Wait until userId is set from auth

      try {
        const remote = await loadUserProfile(user.id);
        if (remote) {
          const { fullName, insuranceNumber, nationality, dateOfBirth, contactName, contactPhone, medicalNotes } =
            remote;
          const merged = {
            fullName,
            insuranceNumber,
            nationality: nationality ?? '',
            dateOfBirth: dateOfBirth ?? '',
            contactName,
            contactPhone,
            medicalNotes: medicalNotes ?? '',
          };
          setFormData(merged);
          localStorage.setItem('userProfile', JSON.stringify(merged));
          localStorage.setItem('userId', user.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void maybeLoadRemoteProfile();
  }, [userId, user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Allow saving with empty fields – use empty string for missing
    const data = {
      fullName: formData.fullName?.trim() ?? '',
      insuranceNumber: formData.insuranceNumber?.trim() ?? '',
      contactName: formData.contactName?.trim() ?? '',
      contactPhone: formData.contactPhone?.trim() ?? '',
      nationality: formData.nationality?.trim() || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      medicalNotes: formData.medicalNotes?.trim() || undefined,
    };

    // Guest: only localStorage and context
    if (!user?.id) {
      localStorage.setItem('userProfile', JSON.stringify(data));
      setProfileContext(data);
      alert(language === 'en' ? 'Profile saved successfully!' : 'บันทึกโปรไฟล์สำเร็จ!');
      navigate('/');
      return;
    }

    // Logged in: save to Supabase first – only show success when saved
    try {
      await saveUserProfile(user.id, data);
      localStorage.setItem('userProfile', JSON.stringify(data));
      localStorage.setItem('userId', user.id);
      setProfileContext(data);
      alert(language === 'en' ? 'Profile saved successfully!' : 'บันทึกโปรไฟล์สำเร็จ!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(language === 'en' ? 'Failed to save to cloud. Data saved locally.' : 'บันทึกลงคลาวด์ไม่สำเร็จ ข้อมูลถูกบันทึกในเครื่อง');
    }
  };

  const handleContinueWithout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header title={t('profileTitle')} />
      
      <form onSubmit={handleSaveProfile} className="flex-1 px-6 py-6 space-y-5 overflow-y-auto">
        {/* Explanation */}
        <div className="bg-gray-100 dark:bg-[var(--secondary)] border border-gray-300 dark:border-[var(--border)] rounded-xl p-4">
          <p className="text-gray-700 dark:text-[var(--muted-foreground)] text-sm leading-relaxed">
            ℹ️ {t('profileExplanation')}
          </p>
          {user && !formData.fullName && (
            <p className="text-gray-600 dark:text-[var(--muted-foreground)] text-sm mt-2 font-medium">
              {language === 'en' ? 'Complete your profile to continue – required after registration.' : 'กรอกโปรไฟล์ของคุณเพื่อดำเนินการต่อ – จำเป็นหลังการสมัครสมาชิก'}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
            <User className="w-4 h-4" />
            {t('fullName')} <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors bg-white"
            placeholder="John Doe"
          />
        </div>

        {/* Insurance Number */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
            <CreditCard className="w-4 h-4" />
            {t('insuranceNumber')} <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            name="insuranceNumber"
            value={formData.insuranceNumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors bg-white"
            placeholder="Insurance number"
          />
        </div>

        {/* Nationality */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
            <Globe className="w-4 h-4" />
            {t('nationality')}
          </label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors bg-white"
            placeholder="e.g., American, Thai, British"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
            <Calendar className="w-4 h-4" />
            {t('dateOfBirth')}
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors bg-white"
          />
        </div>

        {/* Emergency Contact Section */}
        <div className="border-t border-gray-300 pt-5 space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-[var(--foreground)]">
            {t('emergencyContact')}
          </h3>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
              <User className="w-4 h-4" />
              {t('contactName')} <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors bg-white"
              placeholder="Emergency contact's name"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
              <Phone className="w-4 h-4" />
              {t('contactPhone')} <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors bg-white"
              placeholder="+66 XX XXX XXXX"
            />
          </div>
        </div>

        {/* Medical Notes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)]">
            <Heart className="w-4 h-4" />
            {t('medicalNotes')}
          </label>
          <textarea
            name="medicalNotes"
            value={formData.medicalNotes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-gray-900 focus:outline-none transition-colors resize-none bg-white"
            placeholder={t('medicalNotesPlaceholder')}
          />
        </div>

        {/* Buttons */}
        <div className="space-y-4 pt-4 pb-4">
          <button
            type="submit"
            className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-900 dark:border-[var(--foreground)] hover:border-gray-700 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-semibold"
          >
            {t('saveProfile')}
          </button>
          
          {!user && (
            <button
              type="button"
              onClick={handleContinueWithout}
              className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-700 dark:text-[var(--muted-foreground)] font-medium"
            >
              {t('continueWithoutProfile')}
            </button>
          )}
        </div>
      </form>
      
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}