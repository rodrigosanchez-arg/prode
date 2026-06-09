"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Check, Lock } from "lucide-react"
import type { Partido, Prediccion } from "@/lib/types"
import { crearPrediccion, ApiError } from "@/lib/api"
import { cn } from "@/lib/utils"
import {
  ESTADO_CLASES,
  ESTADO_LABEL,
  formatFecha,
} from "@/lib/format"
import { Button } from "@/components/ui/button"

interface Props {
  partido: Partido
  prediccion?: Prediccion
  onSaved: () => void
}

function TeamSide({
  nombre,
  bandera,
  align,
}: {
  nombre: string
  bandera?: string | null
  align: "left" | "right"
}) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-2",
        align === "right" && "flex-row-reverse text-right",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-bold">
        {bandera ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bandera || "/placeholder.svg"} alt="" className="size-full object-cover" />
        ) : (
          nombre.slice(0, 3).toUpperCase()
        )}
      </span>
      <span className="text-sm font-semibold leading-tight">{nombre}</span>
    </div>
  )
}

export function MatchCard({ partido, prediccion, onSaved }: Props) {
  const cerrado = partido.estado !== "pendiente"
  const [local, setLocal] = useState<string>(
    prediccion ? String(prediccion.goles_local_predicho) : "",
  )
  const [visitante, setVisitante] = useState<string>(
    prediccion ? String(prediccion.goles_visitante_predicho) : "",
  )
  const [saving, setSaving] = useState(false)

  const nombreLocal = partido.equipo_local?.nombre ?? "Local"
  const nombreVisitante = partido.equipo_visitante?.nombre ?? "Visitante"

  async function guardar() {
    if (local === "" || visitante === "") {
      toast.error("Cargá ambos resultados")
      return
    }
    setSaving(true)
    try {
      await crearPrediccion({
        partido_id: partido.id,
        goles_local_predicho: Number(local),
        goles_visitante_predicho: Number(visitante),
      })
      toast.success("Pronóstico guardado")
      onSaved()
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "No se pudo guardar",
      )
    } finally {
      setSaving(false)
    }
  }

  // Función interna para formatear el texto del pronóstico guardado
  function obtenerTextoPrediccion() {
    if (!prediccion) return ""
    const gL = prediccion.goles_local_predicho
    const gV = prediccion.goles_visitante_predicho

    if (gL > gV) return `Gana ${nombreLocal} (${gL}-${gV})`
    if (gV > gL) return `Gana ${nombreVisitante} (${gL}-${gV})`
    return `Empate (${gL}-${gV})`
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {formatFecha(partido.fecha_hora)}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
            ESTADO_CLASES[partido.estado],
          )}
        >
          {ESTADO_LABEL[partido.estado]}
        </span>
      </div>

      {/* Resultado real cuando ya hay datos */}
      {(partido.goles_local !== null || partido.goles_visitante !== null) && (
        <div className="mb-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Resultado real:</span>
          <span className="font-mono font-semibold text-foreground">
            {partido.goles_local ?? "-"} : {partido.goles_visitante ?? "-"}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <TeamSide
          nombre={nombreLocal}
          bandera={partido.equipo_local?.bandera}
          align="left"
        />

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={local}
            disabled={cerrado || saving}
            onChange={(e) => setLocal(e.target.value)}
            aria-label={`Goles de ${nombreLocal}`}
            className="h-11 w-12 rounded-md border border-input bg-background text-center text-lg font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
          />
          <span className="text-muted-foreground">:</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={visitante}
            disabled={cerrado || saving}
            onChange={(e) => setVisitante(e.target.value)}
            aria-label={`Goles de ${nombreVisitante}`}
            className="h-11 w-12 rounded-md border border-input bg-background text-center text-lg font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
          />
        </div>

        <TeamSide
          nombre={nombreVisitante}
          bandera={partido.equipo_visitante?.bandera}
          align="right"
        />
      </div>

      {/* BLOQUE INFERIOR MODIFICADO */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {prediccion ? (
          <div className="flex flex-col gap-0.5">
            {/* Texto dinámico del pronóstico: Gana Local (X-Y) */}
            <span className="text-xs font-semibold text-foreground">
              Tu jugada: {obtenerTextoPrediccion()}
            </span>
            
            {/* Estado de los puntos o confirmación */}
            {partido.estado === "finalizado" ? (
              <span className="text-[11px] font-medium text-primary">
                +{prediccion.puntos_ganados ?? 0} pts ganados
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Check className="size-3 text-primary" /> Pronóstico guardado
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Sin pronóstico</span>
        )}

        {cerrado ? (
          <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
            <Lock className="size-3.5" /> Cerrado
          </span>
        ) : (
          <Button size="sm" onClick={guardar} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            {prediccion ? "Actualizar" : "Guardar"}
          </Button>
        )}
      </div>
    </div>
  )
}
