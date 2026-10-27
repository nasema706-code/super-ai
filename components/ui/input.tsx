import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-full border border-white/12 bg-white/4 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
