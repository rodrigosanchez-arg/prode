import { SiteHeader } from "@/components/site-header"
import { RequireAuth } from "@/components/require-auth"
import { RankingTable } from "@/components/ranking-table"

export const metadata = {
  title: "Posiciones — Prode Mundial",
}

export default function PosicionesPage() {
  return (
    <>
      <SiteHeader />
      <RequireAuth>
        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Tabla de posiciones
            </h1>
            <p className="text-pretty text-sm text-muted-foreground">
              El ranking de todos los participantes según los puntos acumulados.
            </p>
          </div>
          <RankingTable />
        </main>
      </RequireAuth>
    </>
  )
}
