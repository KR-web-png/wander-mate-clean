import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

const inputVariants = cva(
  "flex w-full rounded-xl border bg-background text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-input hover:border-primary/30",
        filled: "bg-muted border-transparent hover:bg-muted/80",
        ghost: "border-transparent bg-transparent hover:bg-muted/50",
      },
      inputSize: {
        default: "h-11 px-4 py-2 text-sm",
        sm: "h-9 px-3 py-1.5 text-xs",
        lg: "h-13 px-5 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, icon: Icon, iconPosition = 'left', error, ...props }, ref) => {
    const hasIcon = !!Icon;
    
    return (
      <div className="relative w-full">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            inputVariants({ variant, inputSize }),
            hasIcon && iconPosition === 'left' && 'pl-10',
            hasIcon && iconPosition === 'right' && 'pr-10',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        
        {error && (
          <p className="mt-1.5 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
