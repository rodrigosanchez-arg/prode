// Listado local de los 48 equipos clasificados al Mundial 2026.
// La API de partidos solo devuelve el NOMBRE del equipo (string), así que
// resolvemos los datos visuales (bandera) desde acá buscando por nombre.
//
// - bandera: ruta a la imagen de la bandera (usamos flagcdn por código ISO).
// - codigo: lo dejamos vacío a propósito, según lo pedido.

import type { Equipo } from "./types"

// Helper para armar la ruta de la bandera desde un código ISO de flagcdn.
const flag = (iso: string) => `https://flagcdn.com/w80/${iso}.png`

// nombre + iso (solo se usa para construir la ruta de la bandera).
const DATOS: { nombre: string; iso: string }[] = [
  // Coanfitriones
  { nombre: "Canadá", iso: "ca" },
  { nombre: "Estados Unidos", iso: "us" },
  { nombre: "México", iso: "mx" },
  // CONMEBOL
  { nombre: "Argentina", iso: "ar" },
  { nombre: "Brasil", iso: "br" },
  { nombre: "Colombia", iso: "co" },
  { nombre: "Ecuador", iso: "ec" },
  { nombre: "Paraguay", iso: "py" },
  { nombre: "Uruguay", iso: "uy" },
  // UEFA
  { nombre: "Alemania", iso: "de" },
  { nombre: "Austria", iso: "at" },
  { nombre: "Bélgica", iso: "be" },
  { nombre: "Bosnia y Herzegovina", iso: "ba" },
  { nombre: "Croacia", iso: "hr" },
  { nombre: "Escocia", iso: "gb-sct" },
  { nombre: "España", iso: "es" },
  { nombre: "Francia", iso: "fr" },
  { nombre: "Inglaterra", iso: "gb-eng" },
  { nombre: "Noruega", iso: "no" },
  { nombre: "Países Bajos", iso: "nl" },
  { nombre: "Portugal", iso: "pt" },
  { nombre: "República Checa", iso: "cz" },
  { nombre: "Suecia", iso: "se" },
  { nombre: "Suiza", iso: "ch" },
  { nombre: "Turquía", iso: "tr" },
  // CAF
  { nombre: "Argelia", iso: "dz" },
  { nombre: "Cabo Verde", iso: "cv" },
  { nombre: "Costa de Marfil", iso: "ci" },
  { nombre: "Egipto", iso: "eg" },
  { nombre: "Ghana", iso: "gh" },
  { nombre: "Marruecos", iso: "ma" },
  { nombre: "República Democrática del Congo", iso: "cd" },
  { nombre: "Senegal", iso: "sn" },
  { nombre: "Sudáfrica", iso: "za" },
  { nombre: "Túnez", iso: "tn" },
  // AFC
  { nombre: "Arabia Saudita", iso: "sa" },
  { nombre: "Australia", iso: "au" },
  { nombre: "Catar", iso: "qa" },
  { nombre: "Corea del Sur", iso: "kr" },
  { nombre: "Irán", iso: "ir" },
  { nombre: "Irak", iso: "iq" },
  { nombre: "Jordania", iso: "jo" },
  { nombre: "Japón", iso: "jp" },
  { nombre: "Uzbekistán", iso: "uz" },
  // CONCACAF
  { nombre: "Curazao", iso: "cw" },
  { nombre: "Haití", iso: "ht" },
  { nombre: "Panamá", iso: "pa" },
  // OFC
  { nombre: "Nueva Zelanda", iso: "nz" },
]

export const EQUIPOS: Equipo[] = DATOS.map((d, i) => ({
  id: i + 1,
  nombre: d.nombre,
  bandera: flag(d.iso),
  codigo: "",
}))

// Normaliza un nombre para comparar sin importar mayúsculas/acentos.
// Ej: "Sudafrica" === "Sudáfrica".
function normalizar(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // saca acentos
    .toLowerCase()
    .trim()
}

const POR_NOMBRE = new Map<string, Equipo>(
  EQUIPOS.map((e) => [normalizar(e.nombre), e]),
)

// Busca un equipo por nombre. Si no está en la lista, devuelve un equipo
// mínimo con el nombre tal cual vino de la API (sin bandera).
export function buscarEquipo(nombre: string | null | undefined): Equipo | null {
  if (!nombre) return null
  const found = POR_NOMBRE.get(normalizar(nombre))
  if (found) return found
  return { id: -1, nombre, bandera: null, codigo: "" }
}
