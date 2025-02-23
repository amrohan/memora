"use client";
import React from "react";
import { Navbar, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";
import { Bookmark, Folder, Home, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const path = usePathname();

  const bottomNavigation = [
    { title: "Home", url: "/home", icon: Home },
    { title: "Bookmark", url: "/bookmark", icon: Bookmark },
    { title: "Search", url: "/search", icon: Search },
    { title: "Collections", url: "/collections", icon: Folder },
    { title: "Profile", url: "/profile", icon: User },
  ];

  return (
    <Navbar
      className="max-w-md fixed bottom-0 left-0 w-full dark:bg-foreground-50 bg-white shadow-md"
      position="static"
    >
      <NavbarContent className="flex justify-between w-full ">
        {bottomNavigation.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = path === item.url;

          return (
            <NavbarItem key={index} className="flex-1">
              <Link
                className={`flex flex-col items-center justify-center w-full gap-1 ${
                  isActive ? "text-primary-400" : "text-default-500"
                }`}
                color="foreground"
                href={item.url}
              >
                <IconComponent className="size-4" />
                <span
                  className={`text-tiny ${isActive ? "text-primary-400" : "text-default-500"}`}
                >
                  {item.title}
                </span>
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>
    </Navbar>
  );
}
