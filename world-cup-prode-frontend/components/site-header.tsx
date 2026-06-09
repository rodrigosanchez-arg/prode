"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Trophy, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

const NAV = [
  { href: "/partidos", label: "Partidos" },
  { href: "/posiciones", label: "Posiciones" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { token, user, logout } = useAuth()

  function handleLogout() {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trophy className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Prode<span className="text-primary">Mundial</span>
          </span>
        </Link>

        {token && (
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {token ? (
            <>
              {user?.apodo && (
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {user.apodo}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
