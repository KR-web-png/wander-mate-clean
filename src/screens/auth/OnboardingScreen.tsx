import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, Users, Heart, Shield, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { authService } from '@/services/auth.service';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    icon: MapPin,
    title: 'Discover Amazing Destinations',
    description: 'Explore breathtaking locations around the world and find your next adventure.',
    color: 'bg-sunset'
  },
  {
    id: 2,
    icon: Users,
    title: 'Find Your Travel Companions',
    description: 'Match with like-minded travelers who share your interests and travel style.',
    color: 'bg-ocean'
  },
  {
    id: 3,
    icon: Heart,
    title: 'Plan Together, Travel Better',
    description: 'Create and join trips, chat with your group, and build lasting friendships.',
    color: 'bg-coral'
  },
  {
    id: 4,
    icon: Shield,
    title: 'Travel Safe & Secure',
    description: 'Verified profiles, emergency contacts, and location sharing for peace of mind.',
    color: 'bg-forest'
  }
];

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

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('');

  const isIntroComplete = currentStep >= steps.length;
  const isInterestsStep = currentStep === steps.length;
  const isStyleStep = currentStep === steps.length + 1;

  const handleNext = () => {
    if (isStyleStep) {
      // Save user preferences before navigating to home
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleComplete = async () => {
    // Update user profile with selected preferences
    const currentUser = authService.getCurrentUser();
    if (currentUser && (selectedInterests.length > 0 || selectedStyle)) {
      await authService.updateProfile({
        interests: selectedInterests.length > 0 ? selectedInterests : currentUser.interests,
        travelStyle: selectedStyle || currentUser.travelStyle,
      });
    }
    navigate('/home');
  };

  const handleSkip = () => {
    navigate('/home');
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Intro slides
  if (!isIntroComplete) {
    const step = steps[currentStep];
    const Icon = step.icon;

    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Skip button */}
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip
          </Button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-12">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentStep 
                  ? "w-8 bg-primary" 
                  : index < currentStep 
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className={cn(
            "h-24 w-24 rounded-3xl flex items-center justify-center mb-8 animate-fade-in-up",
            step.color
          )}>
            <Icon className="h-12 w-12 text-primary-foreground" />
          </div>
          
          <h2 className="font-display text-2xl font-bold text-foreground mb-4 animate-fade-in-up" 
              style={{ animationDelay: '0.1s' }}>
            {step.title}
          </h2>
          
          <p className="text-muted-foreground max-w-sm animate-fade-in-up"
             style={{ animationDelay: '0.2s' }}>
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-8">
          <Button 
            variant="sunset" 
            size="lg" 
            className="w-full"
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Interests selection
  if (isInterestsStep) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="px-6 pt-12 pb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            What do you love?
          </h2>
          <p className="text-muted-foreground mt-2">
            Select your travel interests to find like-minded companions
          </p>
        </div>

        <div className="flex-1 px-6 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {interests.map(interest => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                size="lg"
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedInterests.includes(interest) 
                    ? "bg-primary text-primary-foreground scale-105" 
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
        </div>

        <div className="px-6 pb-8 pt-4 space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            {selectedInterests.length} selected (minimum 3)
          </p>
          <Button 
            variant="sunset" 
            size="lg" 
            className="w-full"
            onClick={handleNext}
            disabled={selectedInterests.length < 3}
          >
            Continue
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
        </div>
      </div>
    );
  }

  // Travel style selection
  if (isStyleStep) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="px-6 pt-12 pb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            How do you travel?
          </h2>
          <p className="text-muted-foreground mt-2">
            Choose your primary travel style
          </p>
        </div>

        <div className="flex-1 px-6 overflow-y-auto">
          <div className="space-y-3">
            {travelStyles.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  "w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-4",
                  selectedStyle === style.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <span className="text-3xl">{style.emoji}</span>
                <span className="font-medium text-foreground">{style.label}</span>
                {selectedStyle === style.id && (
                  <Check className="h-5 w-5 text-primary ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-8 pt-4 space-y-3">
          <Button 
            variant="sunset" 
            size="lg" 
            className="w-full"
            onClick={handleNext}
            disabled={!selectedStyle}
          >
            Start Exploring
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
