"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function AuthForm() {
  const router = useRouter()
  const { login, register } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setLoading(true)
    try {
      await login({
        correo: String(form.get("correo")),
        password: String(form.get("password")),
      })
      toast.success("¡Bienvenido de vuelta!")
      router.push("/partidos")
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "No se pudo iniciar sesión",
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setLoading(true)
    try {
      await register({
        correo: String(form.get("correo")),
        nombre: String(form.get("nombre")),
        apellido: String(form.get("apellido")),
        apodo: String(form.get("apodo")),
        password: String(form.get("password")),
      })
      toast.success("¡Cuenta creada! A pronosticar.")
      router.push("/partidos")
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "No se pudo crear la cuenta",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Ingresar</TabsTrigger>
        <TabsTrigger value="register">Crear cuenta</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-6">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-correo">Correo</Label>
            <Input
              id="login-correo"
              name="correo"
              type="email"
              required
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading && <Loader2 className="size-4 animate-spin" />}
            Ingresar
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="register" className="mt-6">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-nombre">Nombre</Label>
              <Input id="reg-nombre" name="nombre" required placeholder="Lionel" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-apellido">Apellido</Label>
              <Input
                id="reg-apellido"
                name="apellido"
                required
                placeholder="Messi"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-apodo">Apodo</Label>
            <Input id="reg-apodo" name="apodo" required placeholder="La Pulga" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-correo">Correo</Label>
            <Input
              id="reg-correo"
              name="correo"
              type="email"
              required
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-password">Contraseña</Label>
            <Input
              id="reg-password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <Button type="submit" disabled={loading} className="mt-2 w-full">
            {loading && <Loader2 className="size-4 animate-spin" />}
            Crear cuenta
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
