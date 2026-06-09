"use client"

import useSWR from "swr"
import { Loader2, Trophy, Medal, DollarSign, Users } from "lucide-react"
import { getRanking } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"


// 💰 Define acá cuánto cuesta la inscripción en tu moneda local
const PRECIO_INSCRIPCION = 5000

export function RankingTable() {
  const { data, error, isLoading } = useSWR("ranking", getRanking)
  const { user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-destructive">
          No se pudo cargar la tabla de posiciones.
        </p>
      </div>
    )
  }

  const ranking = [...(data ?? [])].sort((a, b) => b.puntos - a.puntos)
  const podio = ranking.slice(0, 3)

  // 🧮 CÁLCULO DEL POZO ACUMULADO
  const usuariosPagados = ranking.filter(item => item.pagado).length
  const pozoTotal = usuariosPagados * PRECIO_INSCRIPCION

  return (
    <div className="flex flex-col gap-6">
      {/* Podio */}
      {podio.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[1, 0, 2].map((idx) => {
            const item = podio[idx]
            if (!item) return <div key={idx} />
            const puesto = idx + 1
            return (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border border-border bg-card p-4 text-center",
                  puesto === 1 && "ring-1 ring-primary",
                  puesto === 1 ? "order-2" : puesto === 2 ? "order-1 mt-4" : "order-3 mt-4",
                )}
              >
                <Medal
                  className={cn(
                    "size-6",
                    puesto === 1
                      ? "text-primary"
                      : puesto === 2
                        ? "text-muted-foreground"
                        : "text-accent",
                  )}
                />
                <span className="truncate text-sm font-semibold">
                  {item.apodo}
                </span>
                <span className="text-lg font-bold text-primary">
                  {item.puntos}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {puesto}º puesto
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* 💵 APARTADO: POZO ACUMULADO */}
      {ranking.length > 0 && (
        <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-primary/5 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pozo Acumulado 🏆
              </span>
              <span className="text-3xl font-black tracking-tight text-foreground font-mono">
                ${pozoTotal.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="flex flex-col items-end justify-center rounded-lg bg-primary/10 px-3 py-2 text-right">
              <span className="flex items-center gap-1 text-xs font-bold text-primary">
                <Users className="size-3.5" /> {usuariosPagados}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">
                Anotados pagos
              </span>
            </div>
          </div>
          {/* Un sutil indicador abajo para dar contexto */}
          <div className="mt-3 text-[11px] text-muted-foreground">
            Inscripción: <span className="font-semibold text-foreground">${PRECIO_INSCRIPCION.toLocaleString("es-AR")}</span> por jugador. ¡El 100% va para los ganadores!
          </div>
        </div>
      )}

      {/* Tabla completa */}
      {/* Tabla completa */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Jugador</th>
              <th className="px-4 py-3 text-right font-medium">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, i) => {
              const esYo = user?.apodo === item.apodo
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b border-border/60 last:border-0",
                    esYo && "bg-primary/10",
                  )}
                >
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex size-6 items-center justify-center rounded-full text-xs font-bold",
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.apodo}</span>
                      
                      {/* 🌟 ESTRELLITA DE PAGADO */}
                      {item.pagado && (
                        <span
                          title="Inscripción paga" 
                          className="inline-flex items-center justify-center text-amber-500 animate-pulse-slow"
                        >
                          ★
                        </span>
                      )}

                      {esYo && (
                        <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Vos
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.nombre} {item.apellido}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-base font-bold">
                    {item.puntos}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {ranking.length === 0 && (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <Trophy className="size-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Todavía no hay puntos cargados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
