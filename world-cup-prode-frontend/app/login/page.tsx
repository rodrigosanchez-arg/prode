import Link from "next/link"
import { Trophy } from "lucide-react"
import { AuthForm } from "@/components/auth-form"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Ingresar — Prode Mundial",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <Link href="/" className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Trophy className="size-7" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Prode<span className="text-primary">Mundial</span>
            </h1>
            <p className="text-pretty text-sm text-muted-foreground">
              Pronosticá cada partido y peleá la cima de la tabla.
            </p>
          </div>
        </Link>

        <Card className="w-full">
          <CardContent className="pt-6">
            <AuthForm />
          </CardContent>
        </Card>

        <p className="text-balance text-center text-xs text-muted-foreground">
          Al continuar aceptás participar del Prode del Mundial.
        </p>
      </div>
    </main>
  )
}
