"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import WalletConnect from "./WalletConnect";
import { useAccount } from "@getpara/react-sdk";
export function NavBar() {
  const navItems = [
    {
      name: "Projects",
      link: "/",
    },
    {
      name: "Portfolio",
      link: "#pricing",
    },
    {
      name: "Leaderboard",
      link: "/leaderboard",
    },
  ];
  const { data: account } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4 relative">
            {/* {account?.isConnected ? "" : <NavbarButton variant="secondary">Login</NavbarButton>} */}
            {/* <NavbarButton variant="primary" className="rounded-full bg-peach-400">Sign up</NavbarButton> */}
            <WalletConnect />
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {/* <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full"
              >
                Login
              </NavbarButton> */}
              <NavbarButton  onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full rounded-full bg-peach-400">Sign up</NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

    </div>
  );
}

