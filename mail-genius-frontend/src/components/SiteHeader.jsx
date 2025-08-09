import React from 'react';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import "@/styles/site-header.scss";

export function SiteHeader() {

    return (
        <header className="shadow-md bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <div className="flex h-12 w-full items-center gap-2 px-4">
                <img src="/mail-genius-high-resolution-logo-transparent.png" alt="Logo" className="h-10 w-152" />
                {/* <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      */}
            </div>
        </header>
    )
}
