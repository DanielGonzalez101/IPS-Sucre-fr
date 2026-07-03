"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { signIn } from "@/actions/auth";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await signIn({
        email: form.get("email") as string,
        password: form.get("password") as string,
      });
      if (result?.error) {
        const err = result.error;
        const msg =
          "_server" in err
            ? err._server[0]
            : (err.email?.[0] ??
              err.password?.[0] ??
              "Error al iniciar sesión");
        setError(msg);
      }
    });
  }

  return (
    <div className="min-h-screen bg-azul-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-card shadow-card p-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Cardiocentro Pediátrico de Sucre"
            width={160}
            height={72}
            priority
          />
        </div>

        <h1 className="text-lg font-semibold text-azul-900 text-center mb-6">
          Acceso administrativo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <p
              role="alert"
              className="text-sm text-error bg-red-50 border border-red-200 rounded px-3 py-2"
            >
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gris-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              disabled={isPending}
              className="w-full rounded border border-gris-300 px-3 py-2 text-sm text-gris-900 focus:outline-none focus:ring-2 focus:ring-azul-600 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gris-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={isPending}
              className="w-full rounded border border-gris-300 px-3 py-2 text-sm text-gris-900 focus:outline-none focus:ring-2 focus:ring-azul-600 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded bg-azul-800 py-2.5 text-sm font-semibold text-white hover:bg-azul-700 transition-colors disabled:opacity-60 shadow-button mt-2"
          >
            {isPending ? "Ingresando…" : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

