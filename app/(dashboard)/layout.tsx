"use client"

import type React from "react"

import Link from "next/link"
import { InboxIcon, HistoryIcon, PieChartIcon, LogOutIcon } from "lucide-react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { logout } from "@/actions/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  const handleLogout = async () => {
    await logout()
  }

  const NavItem = ({
    icon: Icon,
    label,
    href,
    onClick,
  }: {
    icon: React.ElementType
    label: string
    href?: string
    onClick?: () => void
  }) => {
    const content = (
      <>
        <Icon className={cn("h-5 w-5", isMobile && "h-6 w-6")} />
        <span className={cn("text-sm", isMobile && "text-xs")}>{label}</span>
      </>
    )

    const className = cn(
      "flex items-center gap-3 p-3 w-full",
      isMobile ? "flex-col justify-center h-16" : "justify-start h-12",
      "hover:bg-secondary/50 rounded-lg transition-colors duration-200",
    )

    if (href) {
      return (
        <Link href={href} className={className}>
          {content}
        </Link>
      )
    }

    return (
      <button className={className} onClick={onClick}>
        {content}
      </button>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && (
        <nav className="w-64 bg-card border-r border-border p-4 flex flex-col">
          <div className="flex-1 space-y-2">
            <NavItem icon={InboxIcon} label="Inbox" href="/tasks" />
            <NavItem icon={HistoryIcon} label="History" href="/history" />
            <NavItem icon={PieChartIcon} label="Insights" href="/insights" />
          </div>
          <NavItem icon={LogOutIcon} label="Logout" onClick={handleLogout} />
        </nav>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-4 pt-16 sm:p-6 pb-16 sm:pb-6">{children}</div>
        {isMobile && (
          <nav className="bg-background border-t border-border flex justify-around items-stretch">
            <NavItem icon={InboxIcon} label="Inbox" href="/tasks" />
            <NavItem icon={HistoryIcon} label="History" href="/history" />
            <NavItem icon={PieChartIcon} label="Insights" href="/insights" />
            <NavItem icon={LogOutIcon} label="Logout" onClick={handleLogout} />
          </nav>
        )}
      </div>
    </div>
  )
}

