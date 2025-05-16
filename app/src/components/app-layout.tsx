"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface AppLayoutProps {
  children: ReactNode
}

function generateBreadcrumbs(pathname: string) {
  const pathParts = pathname.split("/").filter(Boolean)
  
  return pathParts.map((part, index) => {
    const isLast = index === pathParts.length - 1
    const href = `/${pathParts.slice(0, index + 1).join("/")}`
    const displayName = part.length < 16
      ? part.charAt(0).toUpperCase() + part.slice(1)
      : part
    
    return (
      <BreadcrumbItem key={part}>
        {isLast ? (
          <BreadcrumbPage>{displayName}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={href}>{displayName}</BreadcrumbLink>
        )}
        {!isLast && <BreadcrumbSeparator />}
      </BreadcrumbItem>
    )
  })
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const breadcrumbItems = generateBreadcrumbs(pathname)
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-50 w-full flex items-center border-b rounded-t-lg bg-background h-14 px-4 box-border">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
          </Breadcrumb>
          <div className="flex-1" />
        </header>
        <main className="flex-1 box-border p-6 h-full w-full overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
} 