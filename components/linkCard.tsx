import React from "react";
import { Card, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";

import { LinkProp } from "@/types";

export const LinkCard = ({ title, url }: Partial<LinkProp>) => {
  const displayUrl = url ? url.replace(/^https?:\/\//, "") : "No URL";

  return (
    <Card className="w-full" shadow="none">
      <CardHeader className="flex w-full gap-1.5">
        <div className="flex w-10/12 justify-start items-center gap-3 min-w-0">
          {/*Avatar*/}
          <div>
            <Avatar name={title?.charAt(0)} size="md" />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm">{title || "Untitled"}</p>
            <p className="text-small text-default-500 overflow-hidden text-ellipsis whitespace-nowrap min-w-0 max-w-[100%] md:min-w-full">
              {displayUrl}
            </p>
          </div>
        </div>
        <div className="flex justify-end items-center ">
          <Button isIconOnly variant="light">
            <MenuIcon className="text-default-500" />
          </Button>
          <Button isIconOnly variant="light">
            <ArrowUpRight className="text-default-500" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

const MenuIcon = ({ className, ...props }: { className?: string }) => {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
};

const ArrowUpRight = ({ className, ...props }: { className?: string }) => {
  return (
    <svg
      className={className}
      {...props}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
};
