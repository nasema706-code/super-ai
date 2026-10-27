"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-[0.14em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:bg-white/85",
        outline: "border border-white/20 bg-transparent text-white hover:bg-white/8",
        ghost: "text-white/80 hover:bg-white/8 hover:text-white",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-12 px-7",
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
