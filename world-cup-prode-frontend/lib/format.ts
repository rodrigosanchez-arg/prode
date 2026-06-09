import type { EstadoPartido } from "./types"

const MESES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
]

export function formatFecha(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const dia = d.getDate()
  const mes = MESES[d.getMonth()]
  const hora = d.getHours().toString().padStart(2, "0")
  const min = d.getMinutes().toString().padStart(2, "0")
  return `${dia} ${mes} · ${hora}:${min}`
}

export const ESTADO_LABEL: Record<EstadoPartido, string> = {
  pendiente: "Pendiente",
  "en juego": "En juego",
  finalizado: "Finalizado",
}

export const ESTADO_CLASES: Record<EstadoPartido, string> = {
  pendiente: "bg-secondary text-muted-foreground",
  "en juego": "bg-accent/20 text-accent",
  finalizado: "bg-primary/15 text-primary",
}
