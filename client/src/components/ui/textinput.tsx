import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/utils";
import { Slot } from "@radix-ui/react-slot";

const textFieldVariants = cva("flex flex-col gap-1", {
  variants: {
    variant: {
      outlined:
        "border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary",
      filled: "bg-gray-200 rounded-sm focus:outline-none",
      standard:
        "border-b-1 border-gray-300 focus:outline-none focus-within:border-primary focus-within:ring-0",
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
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof textFieldVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "input";

  return (
    <Comp
      className={cn("w-full py-2 px-3", textFieldVariants({ variant, size, className }))}
      {...props}
    />
  );
}

TextField.displayName = "TextField";

export { TextField, textFieldVariants };
