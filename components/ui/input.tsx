import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full border border-border bg-background px-4 text-sm font-light text-foreground outline-none placeholder:text-faint focus:border-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
