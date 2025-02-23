import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type LinkProp = {
  id: number;
  title: string;
  url: string;
  coverImage?: string[];
  description: string;
  note?: string;
  createdAt: string;
  userId: string;
  isShared: boolean;
  isFavorite: boolean;
  tags: TagProp[];
  collection?: CollectionProp;
};

export type CollectionProp = {
  id: number;
  name: string;
  createdAt: string;
  isActive: boolean;
};

export type TagProp = {
  id: number;
  name: string;
  userId: string;
  createdAt: string;
  isActive: boolean;
};
