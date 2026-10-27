import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/75",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
