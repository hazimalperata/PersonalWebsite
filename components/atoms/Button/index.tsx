import React, { CSSProperties, useMemo } from "react";
import clsx from "clsx";
import Link from "next/link";
import { buttonClassname } from "@/components/atoms/Button/cva";
import { ButtonProps } from "@/components/atoms/Button/types";
import LoadingCircle from "@/components/atoms/LoadingCircle";

export default function Button(props: ButtonProps) {
  const {
    label,
    size,
    variant,
    className,
    isLoading,
    disabled,
    icon,
    href,
    tabIndex,
    target,
    buttonClassName,
    ...rest
  } = props;

  const isDisabled = useMemo(
    () => isLoading || disabled,
    [disabled, isLoading],
  );

  const justIcon = useMemo(
    () => label === undefined && icon !== undefined,
    [icon, label],
  );

  const buttonProps = useMemo(() => {
    let buttonSize = 16;

    if (size === "medium") {
      if (justIcon) {
        buttonSize = 20;
      } else {
        buttonSize = 16;
      }
    } else if (size === "large") {
      if (justIcon) {
        buttonSize = 24;
      } else {
        buttonSize = 20;
      }
    }

    return { size: buttonSize };
  }, [justIcon, size]);

  const baseButton = useMemo(
    () => (
      <button
        className={clsx(
          buttonClassname({ variant, size, justIcon }),
          buttonClassName,
          {
            [className as string]: href === undefined,
          },
        )}
        disabled={isDisabled}
        tabIndex={href ? -1 : tabIndex}
        {...rest}
      >
        <div className="flex flex-row items-center justify-center gap-x-[5px]">
          {label !== undefined && label}
          {isLoading ? (
            <LoadingCircle
              style={
                icon === undefined ? undefined : (buttonProps as CSSProperties)
              }
            />
          ) : icon !== undefined ? (
            icon(buttonProps)
          ) : null}
        </div>
      </button>
    ),
    [
      buttonClassName,
      buttonProps,
      className,
      href,
      icon,
      isDisabled,
      isLoading,
      justIcon,
      label,
      rest,
      size,
      tabIndex,
      variant,
    ],
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        className={clsx("w-fit rounded-lg", className)}
      >
        {baseButton}
      </Link>
    );
  }

  return baseButton;
}
