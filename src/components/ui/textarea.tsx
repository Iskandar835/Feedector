import { cn } from "@/lib/utils";

export default function Textarea({
  placeholder,
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      placeholder={placeholder}
      data-slot="textarea"
      className={cn(
        "border-input resize-none h-[150px] placeholder:text-muted-foreground focus-visible:ring-[var(--BG-color)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-white px-3 py-2 text-base shadow-xs transition-[color,box-shadow] duration-300 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}
