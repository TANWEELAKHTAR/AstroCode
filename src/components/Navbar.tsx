"use client"
import React, { useState, useEffect, useRef } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { gsap } from "gsap";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  
  const toggleMenu = () => {
    if (isOpen) {
      // Close menu animation
      gsap.to(menuRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => setIsOpen(false)
      });
    } else {
      setIsOpen(true);
      // Open menu animation
      gsap.fromTo(menuRef.current, 
        { y: "-100%", opacity: 0 }, 
        { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  };

  // Animate hamburger on click
  useEffect(() => {
    if (hamburgerRef.current) {
      const topLine = hamburgerRef.current.querySelector(".hamburger-top");
      const middleLine = hamburgerRef.current.querySelector(".hamburger-middle");
      const bottomLine = hamburgerRef.current.querySelector(".hamburger-bottom");
      
      if (isOpen) {
        gsap.to(topLine, { rotation: 45, y: 8, duration: 0.3 });
        gsap.to(middleLine, { opacity: 0, duration: 0.3 });
        gsap.to(bottomLine, { rotation: -45, y: -8, duration: 0.3 });
      } else {
        gsap.to(topLine, { rotation: 0, y: 0, duration: 0.3 });
        gsap.to(middleLine, { opacity: 1, duration: 0.3 });
        gsap.to(bottomLine, { rotation: 0, y: 0, duration: 0.3 });
      }
    }
  }, [isOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
        gsap.set(menuRef.current, { clearProps: "all" });
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <nav className="max-w-4xl mx-auto flex flex-wrap justify-between items-center py-4 px-4 md:px-8 bg-[#13151B] rounded-xl text-white absolute top-4 md:top-8 left-2 right-2 md:left-0 md:right-0 border border-zinc-600 border-b-0 z-50">
      <div className="flex justify-center items-center">
        <img className="h-6" src="/images/AstroCode.svg" alt="AstroCode Logo" />
      </div>

      {/* Hamburger Menu Button (mobile only) */}
      <button 
        ref={hamburgerRef}
        className="flex flex-col justify-center items-center md:hidden focus:outline-none" 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-top block w-6 h-0.5 bg-white mb-1.5 transition-all"></span>
        <span className="hamburger-middle block w-6 h-0.5 bg-white mb-1.5 transition-all"></span>
        <span className="hamburger-bottom block w-6 h-0.5 bg-white transition-all"></span>
      </button>

      {/* Mobile Menu */}
      <div 
        ref={menuRef}
        className={`${
          isOpen ? "flex" : "hidden"
        } md:hidden absolute top-full left-0 right-0 flex-col w-full bg-[#13151B] border border-zinc-600 rounded-b-xl mt-1 py-4 px-6 opacity-0`}
      >
        <div className="flex flex-col gap-4 mb-6">
          <Link href="/" className="text-base py-2">Features</Link>
          <Link href="/" className="text-base py-2">About</Link>
          <Link href="/" className="text-base py-2">Blog</Link>
        </div>
        <div className="flex flex-col gap-4">
          <SignedOut>
            <SignInButton/>
            <SignUpButton/>
          </SignedOut>
          <SignedIn>
            <div className="py-2">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-center items-center gap-8">
        <Link href="/" className="text-base hover:text-sky-500">Features</Link>
        <Link href="/" className="text-base hover:text-sky-500">About</Link>
        <Link href="/" className="text-base hover:text-sky-500">Blog</Link>
      </div>
      
      <div className="hidden md:flex justify-center items-center">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;