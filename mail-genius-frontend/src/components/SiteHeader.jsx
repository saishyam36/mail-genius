import React from 'react';
import "@/styles/site-header.scss";

export function SiteHeader() {

    return (
        <header className="shadow-md bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <div className="flex h-12 w-full items-center gap-2 px-4">
                <img src="/mail-genius-high-resolution-logo-transparent.png" alt="Logo" className="h-10 w-152" />
                <button className="navButton ml-auto bg-primary text-white px-2 py-2 rounded hover:bg-primary-dark">
                    Sign In
                </button>
            </div>
        </header>
    )
}
