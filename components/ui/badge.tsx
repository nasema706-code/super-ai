import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center border border-border px-2.5 text-[10px] tracking-catalog text-muted uppercase",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
