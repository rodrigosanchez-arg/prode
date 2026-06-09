"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Loader2, CalendarX2 } from "lucide-react"
import { getPartidos, getPredicciones } from "@/lib/api"
import { FASES, type Fase, type Prediccion } from "@/lib/types"
import { cn } from "@/lib/utils"
import { MatchCard } from "@/components/match-card"

type FiltroFase = Fase | "todas"

export function MatchList() {
  const [fase, setFase] = useState<FiltroFase>("todas")

  const {
    data: partidos,
    error,
    isLoading,
  } = useSWR("partidos", getPartidos)

  const { data: predicciones, mutate: mutatePred } = useSWR(
    "predicciones",
    getPredicciones,
  )

  const prediccionesPorPartido = useMemo(() => {
    const map = new Map<number, Prediccion>()
    for (const p of predicciones ?? []) map.set(p.partido_id, p)
    return map
  }, [predicciones])

  const fasesDisponibles = useMemo(() => {
    const set = new Set((partidos ?? []).map((p) => p.fase))
    return FASES.filter((f) => set.has(f.value))
  }, [partidos])

  const filtrados = useMemo(() => {
    const list = partidos ?? []
    const out = fase === "todas" ? list : list.filter((p) => p.fase === fase)
    return [...out].sort(
      (a, b) =>
        new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime(),
    )
  }, [partidos, fase])

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
          No se pudieron cargar los partidos.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Revisá tu conexión con la API e intentá de nuevo.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filtros por fase */}
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
        <FaseChip
          active={fase === "todas"}
          onClick={() => setFase("todas")}
          label="Todas"
        />
        {fasesDisponibles.map((f) => (
          <FaseChip
            key={f.value}
            active={fase === f.value}
            onClick={() => setFase(f.value)}
            label={f.label}
          />
        ))}
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-10 text-center">
          <CalendarX2 className="size-7 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No hay partidos para esta fase.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtrados.map((partido) => (
            <MatchCard
              key={partido.id}
              partido={partido}
              prediccion={prediccionesPorPartido.get(partido.id)}
              onSaved={() => mutatePred()}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FaseChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}

