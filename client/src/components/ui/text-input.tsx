import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/utils";
import { Slot } from "@radix-ui/react-slot";

const textFieldVariants = cva("relative flex flex-col gap-1", {
  variants: {
    variant: {
      outlined:
        "border border-gray-300 rounded-md focus-within:ring-0 focus-within:border-gray-300",
      filled: "bg-gray-200 rounded-md focus-within:ring-0 focus-within:border-gray-300",
      standard: "border-b border-gray-300 focus-within:ring-0 focus-within:border-gray-300",
    },
    size: {
      sm: "text-sm h-8",
      default: "text-base h-10",
      lg: "text-lg h-12",
    },
  },
  defaultVariants: {
    variant: "outlined",
    size: "default",
  },
});

function TextField({
  className,
  variant,
  label,
  placeholder,
  asChild = false,
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof textFieldVariants> & {
    asChild?: boolean;
    label?: string;
    placeholder?: string;
  }) {
  const Comp = asChild ? Slot : "input";
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };

  return (
    <div className={cn("relative", textFieldVariants({ variant, className }))}>
      {label && (
        <label
          className={cn(
            "absolute left-3 text-gray-600 text-[12px] transition-all",
            isFocused || hasValue ? "-top-2 bg-[#fdfdfd] text-xs" : "top-2.5 text-base"
          )}
        >
          {label}
        </label>
      )}
      <Comp
        className={cn("w-full outline-none bg-transparent p-3")}
        placeholder={!label ? placeholder : undefined} // Ẩn placeholder nếu có label
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </div>
  );
}

TextField.displayName = "TextField";

export { TextField, textFieldVariants };
