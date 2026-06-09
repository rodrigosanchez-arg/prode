import { SiteHeader } from "@/components/site-header"
import { RequireAuth } from "@/components/require-auth"
import { MatchList } from "@/components/match-list"

export const metadata = {
  title: "Partidos — Prode Mundial",
}

export default function PartidosPage() {
  return (
    <>
      <SiteHeader />
      <RequireAuth>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Partidos
            </h1>
            <p className="text-pretty text-sm text-muted-foreground">
              Cargá tu pronóstico antes de que arranque cada partido. Una vez que
              empieza, queda cerrado.
            </p>
          </div>
          <MatchList />
        </main>
      </RequireAuth>
    </>
  )
}
