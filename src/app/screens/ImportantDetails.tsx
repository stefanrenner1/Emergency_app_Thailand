import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { HelpModal } from '../components/HelpModal';
import { loadUserProfile, deleteUserProfile } from '../../../utils/supabase/profile';
import { User, CreditCard, Phone, Edit, Trash2, Lock } from 'lucide-react';

interface UserProfile {
  fullName: string;
  insuranceNumber: string;
  contactName: string;
  contactPhone: string;
  nationality?: string;
  dateOfBirth?: string;
  medicalNotes?: string;
}

function ProfileDetailsDisplay({
  profile,
  language,
  isPlaceholder,
}: {
  profile: UserProfile;
  language: string;
  isPlaceholder: boolean;
}) {
  const contactPhone = profile.contactPhone ?? '';
  const canCall = !isPlaceholder && contactPhone.trim().length > 0;
  return (
    <>
      <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 dark:bg-[var(--secondary)] p-2.5 rounded-lg">
            <User className="w-5 h-5 text-gray-700 dark:text-[var(--muted-foreground)]" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-[var(--muted-foreground)] mb-1">
              {language === 'en' ? 'Full Name' : 'ชื่อเต็ม'}
            </p>
            <p className={`text-lg font-semibold ${isPlaceholder ? 'text-gray-600 dark:text-[var(--muted-foreground)]' : 'text-gray-900 dark:text-[var(--foreground)]'}`}>
              {profile.fullName ?? ''}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 dark:bg-[var(--secondary)] p-2.5 rounded-lg">
            <CreditCard className="w-5 h-5 text-gray-700 dark:text-[var(--muted-foreground)]" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 dark:text-[var(--muted-foreground)] mb-1">
              {language === 'en' ? 'Insurance Number' : 'หมายเลขประกัน'}
            </p>
            <p className={`text-lg font-semibold ${isPlaceholder ? 'text-gray-600 dark:text-[var(--muted-foreground)]' : 'text-gray-900 dark:text-[var(--foreground)]'}`}>
              {profile.insuranceNumber ?? ''}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {language === 'en' ? 'Emergency Contact' : 'ผู้ติดต่อฉุกเฉิน'}
        </h3>
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-[var(--muted-foreground)] mb-1">
              {language === 'en' ? 'Contact Name' : 'ชื่อผู้ติดต่อ'}
            </p>
            <p className={`text-base font-semibold ${isPlaceholder ? 'text-gray-600 dark:text-[var(--muted-foreground)]' : 'text-gray-900 dark:text-[var(--foreground)]'}`}>
              {profile.contactName ?? ''}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 dark:text-[var(--muted-foreground)] mb-1">
              {language === 'en' ? 'Contact Phone' : 'เบอร์โทรศัพท์'}
            </p>
            <p className={`text-base font-semibold ${isPlaceholder ? 'text-gray-600 dark:text-[var(--muted-foreground)]' : 'text-gray-900 dark:text-[var(--foreground)]'}`}>
              {profile.contactPhone ?? ''}
            </p>
          </div>
        </div>
        {canCall ? (
          <button
            onClick={() => { window.location.href = `tel:${contactPhone}`; }}
            className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-[#DC2626] hover:border-[#B91C1C] dark:border-[#DC2626] dark:hover:border-[#ef4444] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <div className="bg-[#DC2626] p-3 rounded-xl">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-[var(--foreground)]">
            {language === 'en' ? 'Call Emergency Contact' : 'โทรผู้ติดต่อฉุกเฉิน'}
          </span>
          </button>
        ) : (
          <div className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] flex items-center justify-center gap-2 cursor-not-allowed opacity-60 text-gray-500 dark:text-[var(--muted-foreground)] font-medium">
            <Phone className="w-4 h-4" />
            {language === 'en' ? 'Add profile to call' : 'เพิ่มโปรไฟล์เพื่อโทร'}
          </div>
        )}
      </div>
    </>
  );
}

export default function ImportantDetails() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, loading: authLoading, signOut } = useAuth();
  const { setProfile: setProfileContext } = useProfile();
  const [showHelp, setShowHelp] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const run = async () => {
      // Gast: localStorage
      if (!user) {
        const stored = localStorage.getItem('userProfile');
        if (stored) {
          try {
            const p = JSON.parse(stored);
            setProfile({
              fullName: p.fullName ?? '',
              insuranceNumber: p.insuranceNumber ?? '',
              contactName: p.contactName ?? '',
              contactPhone: p.contactPhone ?? '',
              nationality: p.nationality,
              dateOfBirth: p.dateOfBirth,
              medicalNotes: p.medicalNotes,
            });
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
        return;
      }

      // Eingeloggt: nur aus Supabase laden
      try {
        const remote = await loadUserProfile(user.id);
        if (remote) {
          const p: UserProfile = {
            fullName: remote.fullName ?? '',
            insuranceNumber: remote.insuranceNumber ?? '',
            contactName: remote.contactName ?? '',
            contactPhone: remote.contactPhone ?? '',
            nationality: remote.nationality,
            dateOfBirth: remote.dateOfBirth,
            medicalNotes: remote.medicalNotes,
          };
          setProfile(p);
          setProfileContext(p);
          localStorage.setItem('userProfile', JSON.stringify(p));
          localStorage.setItem('userId', user.id);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Profil laden fehlgeschlagen:', err);
        setProfile(null);
      }
      setLoading(false);
    };

    run();
  }, [authLoading, user?.id]);

  const handleDelete = async () => {
    if (!user?.id) return;
    const confirmMsg = language === 'en'
      ? 'Delete your profile and log out? You can log in again with the same credentials and create a new profile. Your data will remain stored (marked as deleted).'
      : 'ลบโปรไฟล์และออกจากระบบ? คุณสามารถเข้าสู่ระบบอีกครั้งด้วยข้อมูลเดิมและสร้างโปรไฟล์ใหม่ ข้อมูลของคุณจะยังคงเก็บไว้ (ทำเครื่องหมายว่าลบแล้ว)';
    if (!window.confirm(confirmMsg)) return;
    setDeleting(true);
    try {
      await deleteUserProfile(user.id);
      setProfile(null);
      setProfileContext(null);
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userId');
      await signOut();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(language === 'en' ? 'Failed to delete profile' : 'ลบโปรไฟล์ไม่สำเร็จ');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
        <Header title={language === 'en' ? 'Important Details' : 'รายละเอียดสำคัญ'} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-[var(--muted-foreground)]">{language === 'en' ? 'Loading...' : 'กำลังโหลด...'}</p>
        </div>
        <BottomNav onHelpClick={() => setShowHelp(false)} />
      </div>
    );
  }

  if (!profile) {
    if (!user) {
      return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
          <Header title={language === 'en' ? 'Important Details' : 'รายละเอียดสำคัญ'} />
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            <div className="bg-gray-100 dark:bg-[var(--secondary)] p-8 rounded-full mb-6">
              <Lock className="w-16 h-16 text-gray-500 dark:text-[var(--muted-foreground)]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-[var(--foreground)] mb-3 text-center">
              {language === 'en'
                ? 'Login or register to save your details'
                : 'เข้าสู่ระบบหรือสมัครสมาชิกเพื่อบันทึกข้อมูล'}
            </h2>
            <p className="text-gray-600 dark:text-[var(--muted-foreground)] text-center mb-8 max-w-sm text-sm">
              {language === 'en'
                ? 'Your personal information can help emergency services identify you faster.'
                : 'ข้อมูลส่วนตัวของคุณสามารถช่วยให้บริการฉุกเฉินระบุตัวคุณได้เร็วขึ้น'}
            </p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-900 dark:border-[var(--foreground)] hover:border-gray-700 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-semibold"
              >
                {language === 'en' ? 'Login' : 'เข้าสู่ระบบ'}
              </button>
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-semibold"
              >
                {language === 'en' ? 'Register' : 'สมัครสมาชิก'}
              </button>
            </div>
          </div>
          <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
          <BottomNav onHelpClick={() => setShowHelp(true)} />
        </div>
      );
    }
    const emptyProfile: UserProfile = {
      fullName: '',
      insuranceNumber: '',
      contactName: '',
      contactPhone: '',
    };
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
        <Header title={language === 'en' ? 'Important Details' : 'รายละเอียดสำคัญ'} />
        <div className="flex-1 px-6 py-6 space-y-4">
          <div className="bg-gray-100 dark:bg-[var(--secondary)] border border-gray-300 dark:border-[var(--border)] rounded-xl p-4">
            <p className="text-gray-700 dark:text-[var(--muted-foreground)] text-sm text-center leading-relaxed">
              ℹ️ {language === 'en'
                ? 'Add your details for emergency services. You can edit or delete anytime.'
                : 'เพิ่มรายละเอียดของคุณสำหรับบริการฉุกเฉิน คุณสามารถแก้ไขหรือลบได้ตลอดเวลา'}
            </p>
          </div>
          <ProfileDetailsDisplay profile={emptyProfile} language={language} isPlaceholder={false} />
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-semibold flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5" />
            {language === 'en' ? 'Add / Edit Profile' : 'เพิ่ม / แก้ไขโปรไฟล์'}
          </button>
        </div>
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        <BottomNav onHelpClick={() => setShowHelp(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[var(--background)] flex flex-col pb-24">
      <Header title={language === 'en' ? 'Important Details' : 'รายละเอียดสำคัญ'} />
      <div className="flex-1 px-6 py-6 space-y-4">
        <div className="bg-gray-100 dark:bg-[var(--secondary)] border border-gray-300 dark:border-[var(--border)] rounded-xl p-4">
            <p className="text-gray-700 dark:text-[var(--muted-foreground)] text-sm text-center leading-relaxed">
            ℹ️ {language === 'en'
              ? 'This information can help emergency services identify you faster'
              : 'ข้อมูลนี้สามารถช่วยให้หน่วยบริการฉุกเฉินระบุตัวคุณได้เร็วขึ้น'}
          </p>
        </div>

        <ProfileDetailsDisplay profile={profile} language={language} isPlaceholder={false} />

        {(profile.nationality || profile.dateOfBirth || profile.medicalNotes) && (
          <div className="bg-white dark:bg-[var(--card)] border border-gray-300 dark:border-[var(--border)] rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[var(--foreground)] mb-2">
              {language === 'en' ? 'Additional Information' : 'ข้อมูลเพิ่มเติม'}
            </h3>
            {profile.nationality && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-[var(--muted-foreground)] mb-0.5">
                  {language === 'en' ? 'Nationality' : 'สัญชาติ'}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">{profile.nationality}</p>
              </div>
            )}
            {profile.dateOfBirth && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-[var(--muted-foreground)] mb-0.5">
                  {language === 'en' ? 'Date of Birth' : 'วันเกิด'}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-[var(--foreground)]">{profile.dateOfBirth}</p>
              </div>
            )}
            {profile.medicalNotes && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-[var(--muted-foreground)] mb-1">
                  {language === 'en' ? 'Medical Notes' : 'หมายเหตุทางการแพทย์'}
                </p>
                <p className="text-sm text-gray-700 dark:text-[var(--muted-foreground)] bg-gray-50 dark:bg-[var(--secondary)] p-3 rounded-lg leading-relaxed">
                  {profile.medicalNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {user && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-gray-200 dark:border-[var(--border)] hover:border-gray-400 dark:hover:border-[var(--muted-foreground)] active:scale-[0.99] transition-all text-gray-900 dark:text-[var(--foreground)] font-medium flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {language === 'en' ? 'Edit Profile' : 'แก้ไขโปรไฟล์'}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full bg-white dark:bg-[var(--card)] rounded-2xl p-6 shadow-sm border-2 border-red-300 dark:border-red-900/50 hover:border-red-500 dark:hover:border-red-500 active:scale-[0.99] transition-all text-red-700 dark:text-red-400 font-medium flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? (language === 'en' ? 'Deleting...' : 'กำลังลบ...') : (language === 'en' ? 'Delete Profile' : 'ลบโปรไฟล์')}
            </button>
          </div>
        )}
      </div>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <BottomNav onHelpClick={() => setShowHelp(true)} />
    </div>
  );
}
