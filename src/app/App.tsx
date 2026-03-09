import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { ConsentProvider, useConsent } from './contexts/ConsentContext';
import { ConsentScreen } from './components/ConsentScreen';

function AppContent() {
  const { hasConsented, setConsented, isLoading } = useConsent();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[var(--background)]">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!hasConsented) {
    return <ConsentScreen onAccept={setConsented} />;
  }

  return (
    <ProfileProvider>
      <RouterProvider router={router} />
    </ProfileProvider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ConsentProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ConsentProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}