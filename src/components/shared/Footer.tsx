"use client";
import React from "react";
import Link from "next/link";
import farcasterIcon from "@/../public/images/icons/farcaster-icon.svg";
import mirrorIcon from "@/../public/images/icons/mirror-icon.svg";
import xIcon from "@/../public/images/icons/x-icon.svg";
import Image from "next/image";
import { IconMirror } from "../icons/IconMirror";
import { IconX } from "../icons/IconX";
import { IconFarcaster } from "../icons/IconFarcaster";

export const Footer: React.FC = () => {
  const allItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Projects",
      href: "/",
    },
    {
      label: "About q/acc",
      href: "https://qacc.giveth.io/",
      shouldDisplay: true,
    },
    {
      label: "q/acc Paper",
      href: "https://giveth.notion.site/The-q-acc-Paper-d21fa650fde1402882dcceb3b5c26d88",
      shouldDisplay: true,
    },
    {
      label: "FAQ",
      href: "https://qacc.giveth.io/#faq",
      shouldDisplay: true,
    },
    {
      label: "Privacy Policy",
      href: "https://qacc.giveth.io/privacy-policy",
      shouldDisplay: true,
    },
    {
      label: "Terms and Conditions",
      href: "/",
      shouldDisplay: true,
    },
  ];

  const displayedItems = allItems.filter((item) => item.shouldDisplay);

  const halfItems = Math.ceil(displayedItems.length / 2);
  const column1 = displayedItems.slice(0, halfItems);
  const column2 = displayedItems.slice(halfItems);

  return (
    <footer className="bg-neutral-950/30 pt-16 pb-16 px-10 mt-16">
      <div className="container mx-auto">
        <div className="mb-12">
          <Link
            href="/"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
          >
            <Image
              src="/images/logos/logo-horisontal-light.svg"
              alt="logo"
              width={100}
              height={100}
              className="w-[200px] md:w-[300px] h-auto"
            />
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex flex-row w-full">
            {/* Column 1 */}
            <div className="mb-4 lg:mb-0 w-[50%]">
              <ul className="space-y-2">
                {column1.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : "_self"}
                      className="text-neutral-400 font-semibold hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Column 2 */}
            <div className="mb-4 lg:mb-0 w-[50%]">
              <ul className="space-y-2">
                {column2.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : "_self"}
                      className="text-neutral-400 font-semibold hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center sm:gap-8 gap-6">
              <Link
                target="_blank"
                href={"https://x.com/theqacc"}
                className="text-gray-700 hover:text-gray-900"
              >
                <IconX color="white" />
              </Link>
              <Link
                target="_blank"
                href={"https://warpcast.com/theqacc"}
                className="text-gray-700 hover:text-gray-900"
              >
                <IconFarcaster color="white" />
              </Link>
              <Link
                target="_blank"
                href={"https://mirror.xyz/qacc.eth"}
                className="text-gray-700 hover:text-gray-900"
              >
                <IconMirror color="white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
