'use client'
import React from 'react'
import { SignedOut } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import {
  Sheet,

  SheetContent,

  SheetTrigger,
} from "@/components/ui/sheet";

import { navLinks } from '@/constants';

import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
const MobileNav = () => {
    const pathname =  usePathname()
  return (
    <header className="header">
      <Link href="/">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>
      <nav className="flex gap-2">
        <SignedIn>
          <UserButton />

          <Sheet>
            <SheetTrigger>
              {" "}
              <Image
                src="/assets/icons/menu.svg"
                alt="menu"
                width={32}
                height={32}
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-[64]">
              <>
                <Image
                  src="/assets/images/logo-text.svg"
                  alt="menu"
                  width={152}
                  height={32}
                />

                <ul className="header-nav_elements">
                              {navLinks.map((link) => {
                                const isActive = link.route === pathname;
                
                                return (
                                  <li
                                    key={link.route}
                                    className={`${
                                      isActive
                                        && "gradient-tex"} p-18 flex whitespace-nowrap text-dark-700
                                        
                                    `}
                                  >
                                    <Link className="sidebar-link cursor-pointer" href={link.route}>
                                      <Image
                                        src={link.icon}
                                        alt="logo"
                                        width={24}
                                        height={24}
                                       
                                      />
                                      {link.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

         <SignedOut>
                    <Button asChild className="button bg-purple-gradient bg-cover">
                      <Link href={"/sign-in"}>Login</Link>
                    </Button>
                  </SignedOut>
      </nav>
    </header>
  );
}

export default MobileNav