import { cva } from "class-variance-authority";

export const buttonClassname = cva(
  "select-none whitespace-nowrap rounded-lg font-medium h-min w-fit transition-all duration-100",
  {
    variants: {
      variant: {
        outline:
          "border border-gray-300 enabled:text-black-700 bg-transparent enabled:hover:bg-gray-50 disabled:text-gray-300",
        borderless:
          "border border-transparent enabled:text-black-700 bg-transparent enabled:hover:bg-gray-50 disabled:text-gray-300",
        filledBlack:
          "border border-transparent enabled:text-white enabled:bg-black-700 enabled:hover:bg-black disabled:text-gray-500 disabled:bg-gray-100",
        filledRed:
          "border border-transparent enabled:text-white enabled:bg-red-900 enabled:hover:bg-red-800 disabled:text-gray-500 disabled:bg-gray-100",
        filledBlue:
          "border border-transparent enabled:text-white enabled:bg-blue-900 enabled:hover:bg-blue-950 disabled:text-gray-500 disabled:bg-gray-100",
      },
      size: {
        xSmall: "text-xs py-[5px] px-[11px]",
        small: "text-sm py-[5px] px-[11px]",
        medium: "text-sm py-[5px] px-[13px]",
        large: "text-sm py-[7px] px-[15px]",
      },
      justIcon: {
        true: "",
      },
    },
    compoundVariants: [
      {
        size: "xSmall",
        justIcon: true,
        className: "!p-[5px]",
      },
      {
        size: ["small", "medium", "large"],
        justIcon: true,
        className: "!p-[7px]",
      },
      {
        variant: ["filledBlue", "filledRed", "filledBlack"],
        justIcon: true,
        className:
          "enabled:text-white enabled:hover:text-white disabled:text-gray-500",
      },
      {
        variant: ["outline", "borderless"],
        justIcon: true,
        className:
          "enabled:text-gray-700 enabled:hover:text-black-700 disabled:text-gray-500",
      },
    ],
  },
);
