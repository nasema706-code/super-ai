import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none rounded-2xl border border-white/12 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/35",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
