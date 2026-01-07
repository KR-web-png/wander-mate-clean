import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, FileText, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/lib/utils';

interface SafetySection {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const safetySections: SafetySection[] = [
  {
    icon: Shield,
    title: 'Identity Verification',
    description: 'We verify all users through government-issued ID and phone number verification to ensure a safe community.',
    color: 'text-green-500'
  },
  {
    icon: Lock,
    title: 'Data Protection',
    description: 'Your personal information is encrypted and stored securely. We never share your data with third parties without your consent.',
    color: 'text-blue-500'
  },
  {
    icon: Eye,
    title: 'Privacy Controls',
    description: 'You have full control over who can see your profile, trip plans, and contact information. Customize your privacy settings anytime.',
    color: 'text-purple-500'
  },
  {
    icon: Users,
    title: 'Travel Safety',
    description: 'Share your trip details with trusted contacts. Access emergency support and local safety information for your destinations.',
    color: 'text-ocean'
  },
  {
    icon: AlertTriangle,
    title: 'Report & Block',
    description: 'Easily report suspicious behavior or block users. Our moderation team reviews all reports within 24 hours.',
    color: 'text-orange-500'
  },
  {
    icon: FileText,
    title: 'Terms & Policies',
    description: 'Review our Terms of Service, Privacy Policy, and Community Guidelines to understand your rights and responsibilities.',
    color: 'text-gray-500'
  }
];

export const SafetyPrivacyScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Safety & Privacy" showBack />
      
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {/* Introduction */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-sunset flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-2">
            Your Safety Matters
          </h2>
          <p className="text-center text-muted-foreground">
            We're committed to creating a safe and secure travel community
          </p>
        </div>

        {/* Safety Features */}
        <div className="space-y-4 mb-6">
          {safetySections.map((section, index) => {
            const Icon = section.icon;
            
            return (
              <Card
                key={section.title}
                variant="gradient"
                className="p-4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-background/50 flex items-center justify-center">
                      <Icon className={cn("h-6 w-6", section.color)} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {section.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Verification Status */}
        <Card 
          variant="elevated" 
          className="p-4 mb-6 border-2 border-green-500/20 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-display font-semibold text-foreground">
              Your Verification Status
            </h3>
          </div>
          <div className="space-y-2 ml-8">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Email Verified</span>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Phone Verified</span>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">ID Verified</span>
              <Badge variant="success">Verified</Badge>
            </div>
          </div>
        </Card>

        {/* Safety Tips */}
        <Card 
          variant="gradient" 
          className="p-4 mb-6 bg-orange-50 dark:bg-orange-950/20 animate-fade-in"
          style={{ animationDelay: '0.7s' }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                Safety Tips
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Meet in public places for the first time</li>
                <li>• Share your trip plans with trusted contacts</li>
                <li>• Trust your instincts - report suspicious behavior</li>
                <li>• Keep your payment information secure</li>
                <li>• Use in-app messaging until you're comfortable</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={() => navigate('/help/report')}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors"
          >
            <AlertTriangle className="h-6 w-6 text-orange-500 mb-2 mx-auto" />
            <p className="text-sm font-semibold text-foreground">Report Issue</p>
          </button>
          
          <button
            onClick={() => navigate('/help/support')}
            className="p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors"
          >
            <Shield className="h-6 w-6 text-green-500 mb-2 mx-auto" />
            <p className="text-sm font-semibold text-foreground">Get Help</p>
          </button>
        </div>

        {/* Policy Links */}
        <div className="mt-6 space-y-2 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <button className="text-sm text-primary hover:underline w-full text-center">
            Privacy Policy
          </button>
          <button className="text-sm text-primary hover:underline w-full text-center">
            Terms of Service
          </button>
          <button className="text-sm text-primary hover:underline w-full text-center">
            Community Guidelines
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
