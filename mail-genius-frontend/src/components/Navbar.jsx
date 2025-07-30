import React from "react";
import { Button } from "@/components/ui/button"
import "@/styles/navbar.scss";

export default function Navbar() {
  return (
    <nav className="w-full shadow-md">
      <div className="flex items-center justify-between px-6 py-2">
        <img src="/mail-genius-high-resolution-logo-transparent.png" alt="Logo" className="h-10 w-152" />
        <div className="flex justify-end items-center space-x-4">
          <button className="generateButton">
            <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
              <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
            </svg>
            <span className="text">Generate</span>
          </button>
          <button className='navButton'>Login</button>
          {/* <button className='navButton'>Sign Up</button> */}
        </div>
      </div>
    </nav>
  );
}
