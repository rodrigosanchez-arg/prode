// Tipos del dominio del Prode del Mundial.
// Estos reflejan los modelos de tu API después de normalizar el formato "populate".

export type Fase =
  | "grupos"
  | "dieciseisavos"
  | "octavos"
  | "cuartos"
  | "semifinal"
  | "final"

export type EstadoPartido = "pendiente" | "en juego" | "finalizado"

export interface Equipo {
  id: number
  nombre: string
  // La API puede no traer estos, son opcionales
  bandera?: string | null
  codigo?: string | null
}

export interface Usuario {
  id: number
  correo: string
  nombre: string
  apellido: string
  apodo: string
  pagado: boolean
  puntos: number
}

export interface Partido {
  id: string
  equipo_local: Equipo | null
  equipo_visitante: Equipo | null
  fecha_hora: string
  fase: Fase
  grupo: string | null
  goles_local: number | null
  goles_visitante: number | null
  estado: EstadoPartido
}

export interface Prediccion {
  id: string
  usuario_id: number | string
  partido_id: string
  goles_local_predicho: number
  goles_visitante_predicho: number
  puntos_ganados: number | null
  fecha_creacion: string
}

export interface RankingItem {
  id: number
  apodo: string
  nombre: string
  apellido: string
  puntos: number
}

export const FASES: { value: Fase; label: string }[] = [
  { value: "grupos", label: "Fase de grupos" },
  { value: "dieciseisavos", label: "Dieciseisavos" },
  { value: "octavos", label: "Octavos de final" },
  { value: "cuartos", label: "Cuartos de final" },
  { value: "semifinal", label: "Semifinal" },
  { value: "final", label: "Final" },
]
