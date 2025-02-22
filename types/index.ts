import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type LinkProp = {
  id: number;
  title: string;
  url: string;
  description: string;
  createdAt: string;
  userId: string;
  isShared: boolean;
};
