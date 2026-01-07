import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { User, Shield, CheckCircle } from "lucide-react";
import { VerificationStatus } from "@/models";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const badgePositionVariants = cva(
  "absolute flex items-center justify-center rounded-full bg-background ring-2 ring-background",
  {
    variants: {
      size: {
        xs: "h-3 w-3 -right-0.5 -bottom-0.5",
        sm: "h-3.5 w-3.5 -right-0.5 -bottom-0.5",
        default: "h-4 w-4 -right-0.5 -bottom-0.5",
        lg: "h-5 w-5 -right-1 -bottom-1",
        xl: "h-6 w-6 -right-1 -bottom-1",
        "2xl": "h-7 w-7 -right-1 -bottom-1",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  verificationStatus?: VerificationStatus;
  showBadge?: boolean;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, src, alt, fallback, verificationStatus, showBadge = false, ...props }, ref) => {
  const getVerificationIcon = () => {
    switch (verificationStatus) {
      case 'fully_verified':
        return <CheckCircle className="h-full w-full text-forest" />;
      case 'id_verified':
        return <Shield className="h-full w-full text-ocean" />;
      default:
        return null;
    }
  };

  const initials = fallback || alt?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        <AvatarPrimitive.Image
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt}
        />
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium"
        >
          {initials}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      
      {showBadge && verificationStatus && verificationStatus !== 'unverified' && verificationStatus !== 'email_verified' && (
        <div className={cn(badgePositionVariants({ size }))}>
          {getVerificationIcon()}
        </div>
      )}
    </div>
  );
});
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
