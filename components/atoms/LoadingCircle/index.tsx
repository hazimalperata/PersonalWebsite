import clsx from "clsx";
import styles from "./index.module.scss";
import Loading from "./loading.png";
import Image from 'next/image';
import React from "react";
import {LoadingCircleProps} from "@/components/atoms/LoadingCircle/types";

export default function LoadingCircle(props: LoadingCircleProps) {
  const defaultClassName = "h-[17px] w-[17px] min-w-[17px] min-h-[17px]"

  return (
    <div className={clsx(styles.buttonLoading, "relative", {
      [props.className as string]: props.className !== undefined,
      [defaultClassName]: props.className === undefined,
    })} style={props.style}>
      <Image src={Loading} alt="loading" fill sizes="17px" placeholder="blur"/>
    </div>
  );
}
