import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, User, Mail, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { authService } from '@/services/auth.service';
import { TravelStyle } from '@/models';
import { cn } from '@/lib/utils';

const interests = [
  'Photography', 'Hiking', 'Beach', 'Culture', 'Food', 'Nightlife',
  'Adventure', 'Wellness', 'History', 'Art', 'Wildlife', 'Budget Travel',
  'Luxury', 'Solo', 'Group Tours', 'Road Trips'
];

const travelStyles = [
  { id: 'adventure', label: 'Adventure Seeker', emoji: '🏔️' },
  { id: 'relaxation', label: 'Relaxation Lover', emoji: '🏖️' },
  { id: 'cultural', label: 'Culture Explorer', emoji: '🏛️' },
  { id: 'budget', label: 'Budget Traveler', emoji: '💰' },
  { id: 'luxury', label: 'Luxury Enthusiast', emoji: '✨' },
  { id: 'solo', label: 'Solo Adventurer', emoji: '🎒' },
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian',
  'Thai', 'Vietnamese', 'Dutch', 'Swedish', 'Polish', 'Greek'
];

export const EditProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests || []
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    currentUser?.languages || []
  );
  const [selectedStyle, setSelectedStyle] = useState<TravelStyle>(
    currentUser?.travelStyle || 'adventure'
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile
      await authService.updateProfile({
        name,
        email,
        location,
        bio,
        interests: selectedInterests,
        languages: selectedLanguages,
        travelStyle: selectedStyle,
      });

      setSuccess(true);
      
      // Show success message briefly then navigate back
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/profile')}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-lg font-bold text-foreground">
            Edit Profile
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <main className="px-4 pt-6 max-w-lg mx-auto">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Photo */}
          <Card variant="elevated" className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar
                  src={currentUser?.avatar}
                  alt={name}
                  size="2xl"
                  verificationStatus={currentUser?.verificationStatus}
                  showBadge
                />
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-medium hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-5 w-5 text-primary-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Click to change photo
              </p>
            </div>
          </Card>

          {/* Basic Info */}
          <Card variant="elevated" className="p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground mb-4">
              Basic Information
            </h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                variant="filled"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                variant="filled"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input
                type="text"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={MapPin}
                variant="filled"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <textarea
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full min-h-[100px] px-4 py-3 rounded-xl border border-input bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/200
              </p>
            </div>
          </Card>

          {/* Travel Style */}
          <Card variant="elevated" className="p-6">
            <h2 className="font-display font-semibold text-foreground mb-4">
              Travel Style
            </h2>
            <div className="space-y-2">
              {travelStyles.map(style => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id as TravelStyle)}
                  className={cn(
                    "w-full p-3 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3",
                    selectedStyle === style.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <span className="text-2xl">{style.emoji}</span>
                  <span className="font-medium text-foreground text-sm">{style.label}</span>
                  {selectedStyle === style.id && (
                    <Check className="h-4 w-4 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Interests */}
          <Card variant="elevated" className="p-6">
            <h2 className="font-display font-semibold text-foreground mb-4">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    selectedInterests.includes(interest) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => toggleInterest(interest)}
                >
                  {selectedInterests.includes(interest) && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {interest}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {selectedInterests.length} selected
            </p>
          </Card>

          {/* Languages */}
          <Card variant="elevated" className="p-6">
            <h2 className="font-display font-semibold text-foreground mb-4">
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {languages.map(language => (
                <Badge
                  key={language}
                  variant={selectedLanguages.includes(language) ? 'info' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    selectedLanguages.includes(language) 
                      ? "" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => toggleLanguage(language)}
                >
                  {selectedLanguages.includes(language) && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {language}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {selectedLanguages.length} selected
            </p>
          </Card>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <Check className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Profile updated successfully!
              </p>
            </div>
          )}

          {/* Save Button */}
          <Button 
            type="submit" 
            variant="sunset" 
            size="lg" 
            className="w-full"
            loading={loading}
            disabled={success}
          >
            {success ? 'Saved!' : 'Save Changes'}
          </Button>
        </form>
      </main>
    </div>
  );
};
