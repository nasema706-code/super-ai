"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border text-xs font-normal tracking-catalog uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "border-foreground bg-foreground text-background hover:bg-foreground/85",
        outline:
          "border-foreground/40 bg-background/40 text-foreground backdrop-blur-sm hover:border-foreground hover:bg-foreground hover:text-background",
        ghost: "border-border text-muted hover:border-foreground hover:text-foreground",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[11px]",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
