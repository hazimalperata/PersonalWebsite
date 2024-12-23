import React, {CSSProperties} from "react";
import {IconType} from "react-icons";
import {Url} from "@/types/url";

export type ButtonVariants = "outline" | "borderless" | "filledBlack" | "filledRed" | "filledBlue";
export type ButtonSizeVariants = "xSmall" | "small" | "medium" | "large";

type BaseButtonProps = {
  label?: string;
  variant: ButtonVariants;
  size: ButtonSizeVariants;
  isLoading?: boolean;
  style?: CSSProperties;
  className?: string;
  buttonClassName?: string;
  icon?: IconType;
  href?: Url;
  target?: React.HTMLAttributeAnchorTarget;
}

export type ButtonProps = BaseButtonProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

