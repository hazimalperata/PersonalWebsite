import { ReactNode } from "react";

export type DefaultWrapperProps = {
  children: ReactNode | ReactNode[];
  hideNavbar?: boolean;
  hideFooter?: boolean;
};
