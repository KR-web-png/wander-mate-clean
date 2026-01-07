import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Globe } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/common/Card';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

export const LanguagesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    // Navigate back after a short delay to show the selection
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header 
        title={t('languages.title')} 
        showBack 
      />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-center mb-3">
            <div className="h-16 w-16 rounded-full bg-gradient-sunset flex items-center justify-center">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-center text-muted-foreground">
            {t('languages.subtitle')}
          </p>
        </div>

        <Card variant="elevated" className="divide-y divide-border animate-fade-in" 
              style={{ animationDelay: '0.1s' }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={cn(
                "w-full flex items-center justify-between p-4 transition-all",
                language === lang.code
                  ? "bg-sunset/10"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="flex flex-col items-start">
                <span className="font-semibold text-foreground text-lg">
                  {lang.nativeName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {lang.name}
                </span>
              </div>
              
              {language === lang.code && (
                <div className="h-8 w-8 rounded-full bg-gradient-sunset flex items-center justify-center animate-scale-in">
                  <Check className="h-5 w-5 text-white" />
                </div>
              )}
            </button>
          ))}
        </Card>

        <div className="mt-4 text-center text-sm text-muted-foreground animate-fade-in"
             style={{ animationDelay: '0.2s' }}>
          <p>{t('languages.current')}: <span className="font-semibold text-foreground">
            {languages.find(l => l.code === language)?.nativeName}
          </span></p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
