"use client"

import type {
  Fase,
  EstadoPartido,
  Partido,
  Prediccion,
  RankingItem,
  Usuario,
} from "./types"
import { buscarEquipo } from "./equipos"

// URL base de tu API.
export const API_BASE_URL = "http://localhost:4000/api"

const TOKEN_KEY = "prode_token"

/* ----------------------------- Manejo del token ---------------------------- */

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}

/* ------------------------------- Fetch helper ------------------------------ */

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let message = `Error ${res.status}`
    try {
      const body = await res.json()
      message =
        body?.error?.message ?? body?.message ?? body?.error ?? message
    } catch {
      // sin cuerpo JSON
    }
    throw new ApiError(message, res.status)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/* --------------------------- Normalización populate -------------------------- */
// Tu API devuelve los GET con "populate". Soportamos tanto un formato plano
// como el formato anidado típico de Strapi ({ data: { id, attributes: {...} } }).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap(entity: any): any {
  if (entity == null) return null
  // Formato Strapi: { data: { id, attributes } } o { id, attributes }
  if (entity.data !== undefined) entity = entity.data
  if (entity == null) return null
  if (entity.attributes) {
    return { id: entity.id, ...entity.attributes }
  }
  return entity
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapList(payload: any): any[] {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

// La API devuelve fase y estado capitalizados (ej. "Grupos", "Pendiente").
// Los pasamos a nuestro formato canónico en minúsculas.
function normalizeFase(raw: unknown): Fase {
  const f = String(raw ?? "").toLowerCase().trim()
  return (f || "grupos") as Fase
}

function normalizeEstado(raw: unknown): EstadoPartido {
  const e = String(raw ?? "").toLowerCase().trim()
  return (e || "pendiente") as EstadoPartido
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePartido(raw: any): Partido {
  const p = unwrap(raw)
  return {
    id: p._id ?? p.id,
    // La API manda el NOMBRE del equipo (string); lo resolvemos localmente.
    equipo_local: buscarEquipo(p.equipo_local),
    equipo_visitante: buscarEquipo(p.equipo_visitante),
    fecha_hora: p.fecha_hora,
    fase: normalizeFase(p.fase),
    grupo: p.grupo ?? null,
    goles_local: p.goles_local ?? null,
    goles_visitante: p.goles_visitante ?? null,
    estado: normalizeEstado(p.estado),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePrediccion(raw: any): Prediccion {
  const pr = unwrap(raw)
  const usuario = unwrap(pr.usuario) ?? unwrap(pr.usuario_id)
  const partido = unwrap(pr.partido) ?? unwrap(pr.partido_id)
  return {
    id: pr._id ?? pr.id,
    usuario_id: usuario?._id ?? usuario?.id ?? pr.usuario_id ?? pr.usuario,
    partido_id: partido?._id ?? partido?.id ?? pr.partido_id ?? pr.partido,
    goles_local_predicho: pr.goles_local_predicho,
    goles_visitante_predicho: pr.goles_visitante_predicho,
    puntos_ganados: pr.puntos_ganados ?? null,
    fecha_creacion: pr.fecha_creacion ?? pr.createdAt,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeUsuario(raw: any): Usuario {
  const u = unwrap(raw)
  return {
    id: u.id,
    correo: u.correo ?? u.email,
    nombre: u.nombre,
    apellido: u.apellido,
    apodo: u.apodo,
    pagado: Boolean(u.pagado),
    puntos: u.puntos ?? 0,
  }
}

/* --------------------------------- Auth ------------------------------------ */

export interface RegistroPayload {
  correo: string
  nombre: string
  apellido: string
  apodo: string
  password: string
}

export interface LoginPayload {
  correo: string
  password: string
}

export async function registrarUsuario(
  payload: RegistroPayload,
): Promise<Usuario> {
  const data = await apiFetch<unknown>("/usuarios", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return normalizeUsuario(data)
}

export async function login(payload: LoginPayload): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await apiFetch<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const token = data?.token
  if (!token) throw new ApiError("La API no devolvió un token", 500)
  setToken(token)
  return token
}

/* ------------------------------ Recursos GET ------------------------------- */

export async function getPartidos(): Promise<Partido[]> {
  const data = await apiFetch<unknown>("/partidos")
  return unwrapList(data).map(normalizePartido)
}

export async function getPredicciones(token: string): Promise<Prediccion[]> {
  // 1. Cambiamos la ruta a "/predicciones/mis-predicciones" que es la que creamos en Express
  // 2. Le pasamos el token en las opciones del fetch para que viaje en los Headers
  const data = await apiFetch<unknown>("/predicciones/mis-predicciones", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  console.log(data)
  return unwrapList(data).map(normalizePrediccion)
}

export async function getRanking(): Promise<RankingItem[]> {
  const data = await apiFetch<unknown>("/usuarios/ranking")
  return unwrapList(data).map((raw) => {
    const u = normalizeUsuario(raw)
    return {
      id: u.id,
      apodo: u.apodo,
      nombre: u.nombre,
      apellido: u.apellido,
      puntos: u.puntos,
    }
  })
}

/* ------------------------------ Predicciones ------------------------------- */

export interface PrediccionPayload {
  partido_id: string
  goles_local_predicho: number
  goles_visitante_predicho: number
}

export async function crearPrediccion(
  payload: PrediccionPayload,
): Promise<Prediccion> {
  const data = await apiFetch<unknown>("/predicciones", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return normalizePrediccion(data)
}
