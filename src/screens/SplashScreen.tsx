import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SplashScreen as CapacitorSplashScreen } from '@capacitor/splash-screen';

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hide the native splash screen if present
    CapacitorSplashScreen.hide();

    // Show web splash for 3 seconds, then navigate to login
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="relative">
          <img 
            src="/logo.png" 
            alt="Travel Buddy Logo" 
            className="w-80 h-80 object-contain drop-shadow-2xl"
          />
        </div>
        
        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Travel Buddy
          </h1>
          <p className="text-lg text-gray-600">
            Your Travel Companion
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex space-x-2 mt-8">
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
