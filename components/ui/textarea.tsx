import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none border border-border bg-background px-4 py-3 text-sm font-light text-foreground outline-none placeholder:text-faint focus:border-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
