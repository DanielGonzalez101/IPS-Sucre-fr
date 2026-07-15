"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  UserCircle,
  Shield,
  Save,
  CheckCircle2,
  KeyRound,
  Ban,
  RotateCcw,
  Copy,
  Check,
  X,
  AlertTriangle,
  Settings2,
} from "lucide-react";
import {
  createUsuario,
  updateUsuarioPermisos,
  suspenderUsuario,
  reactivarUsuario,
  regenerarPassword,
} from "@/actions/usuarios";
import type { UsuarioAdmin } from "@/types";
import { MODULOS } from "@/lib/permisos";
import Pagination from "@/components/ui/Pagination";

interface Props {
  usuarios: UsuarioAdmin[];
  total: number;
  currentPage: number;
  pageCount: number;
  incluirSuspendidos: boolean;
  error: string | null;
}

type Role = "admin" | "editor" | "viewer";

export function UsuariosManager({
  usuarios: initialUsuarios,
  total,
  currentPage,
  pageCount,
  incluirSuspendidos,
  error: initialError,
}: Props) {
  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [passwordModal, setPasswordModal] = useState<{ email: string; password: string } | null>(null);
  const [gestionUsuario, setGestionUsuario] = useState<UsuarioAdmin | null>(null);

  if (initialError) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Módulo no disponible todavía</p>
          <p className="text-sm text-amber-700 mt-1">{initialError}</p>
        </div>
      </div>
    );
  }

  function upsertUsuario(usuario: UsuarioAdmin) {
    setUsuarios((prev) => {
      const existe = prev.some((u) => u.id === usuario.id);
      return existe ? prev.map((u) => (u.id === usuario.id ? usuario : u)) : [usuario, ...prev];
    });
    setGestionUsuario((prev) => (prev && prev.id === usuario.id ? usuario : prev));
  }

  return (
    <div className="space-y-6">
      <NuevoUsuarioCard
        onCreated={(usuario, password) => {
          upsertUsuario(usuario);
          setPasswordModal({ email: usuario.email, password });
        }}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Usuarios ({total})</span>
          <Link
            href={`/gestion-interna/usuarios?page=0&suspendidos=${incluirSuspendidos ? "0" : "1"}`}
            className="text-xs text-gray-500 hover:text-azul-800 flex items-center gap-1.5"
          >
            <input type="checkbox" checked={incluirSuspendidos} readOnly className="rounded border-gray-300" />
            Ver suspendidos
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="px-5 py-2.5 font-medium">Nombre</th>
                <th className="px-5 py-2.5 font-medium">Email</th>
                <th className="px-5 py-2.5 font-medium">Rol</th>
                <th className="px-5 py-2.5 font-medium">Estado</th>
                <th className="px-5 py-2.5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-gray-400">
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 text-gray-800 font-medium">{usuario.nombre || "—"}</td>
                  <td className="px-5 py-3 text-gray-500">{usuario.email}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {usuario.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {usuario.estado === "suspendido" ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">Suspendido</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">Activo</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setGestionUsuario(usuario)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-azul-800 hover:bg-azul-50 transition-colors"
                    >
                      <Settings2 size={13} />
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="px-5 py-3 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              basePath="/gestion-interna/usuarios"
              extraParams={{ suspendidos: incluirSuspendidos ? "1" : "0" }}
            />
          </div>
        )}
      </div>

      {gestionUsuario && (
        <GestionModal
          usuario={gestionUsuario}
          onUpdated={upsertUsuario}
          onPasswordGenerated={(password) => setPasswordModal({ email: gestionUsuario.email, password })}
          onClose={() => setGestionUsuario(null)}
        />
      )}

      {passwordModal && (
        <PasswordModal
          email={passwordModal.email}
          password={passwordModal.password}
          onClose={() => setPasswordModal(null)}
        />
      )}
    </div>
  );
}

// ── Nuevo usuario ─────────────────────────────────────────────────

function NuevoUsuarioCard({
  onCreated,
}: {
  onCreated: (usuario: UsuarioAdmin, password: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [modulos, setModulos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleModulo(slug: string) {
    setModulos((prev) => (prev.includes(slug) ? prev.filter((m) => m !== slug) : [...prev, slug]));
  }

  function reset() {
    setEmail("");
    setNombre("");
    setRole("editor");
    setModulos([]);
    setError(null);
  }

  function handleCreate() {
    if (!email.trim() || !nombre.trim()) {
      setError("Email y nombre son obligatorios");
      return;
    }
    setError(null);
    startTransition(async () => {
      const r = await createUsuario({
        email: email.trim(),
        nombre: nombre.trim(),
        role,
        modulos_permitidos: modulos,
      });
      if (r.error || !r.data) {
        setError(r.error ?? "No se pudo crear el usuario");
        return;
      }
      onCreated(r.data.usuario, r.data.passwordTemporal);
      reset();
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:border-azul-600 hover:text-azul-800 transition-colors"
      >
        <UserPlus size={15} />
        Nuevo usuario
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Nuevo usuario</span>
        <button
          type="button"
          onClick={() => { setOpen(false); reset(); }}
          aria-label="Cancelar"
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Correo electrónico"
          icon={<Mail size={13} className="text-gray-400" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@cardiopediasucre.com"
        />
        <Field
          label="Nombre"
          icon={<UserCircle size={13} className="text-gray-400" />}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre completo"
        />
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <Shield size={13} className="text-gray-400" />
            Rol
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-medium text-gray-600 mb-2">Módulos permitidos</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MODULOS.map((m) => (
              <label
                key={m.slug}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={modulos.includes(m.slug)}
                  onChange={() => toggleModulo(m.slug)}
                  className="rounded border-gray-300"
                />
                {m.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="px-5 pb-3 text-xs text-red-600">{error}</p>}

      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button
          type="button"
          onClick={handleCreate}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--color-azul-800)" }}
        >
          <UserPlus size={13} />
          {isPending ? "Creando…" : "Crear usuario"}
        </button>
      </div>
    </div>
  );
}

// ── Modal de gestión (rol, módulos, contraseña, suspender) ─────────

function GestionModal({
  usuario,
  onUpdated,
  onPasswordGenerated,
  onClose,
}: {
  usuario: UsuarioAdmin;
  onUpdated: (usuario: UsuarioAdmin) => void;
  onPasswordGenerated: (password: string) => void;
  onClose: () => void;
}) {
  const [role, setRole] = useState<Role>(usuario.role);
  const [modulos, setModulos] = useState<string[]>(usuario.modulos_permitidos);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingEstado, setConfirmingEstado] = useState(false);
  const [isSaving, startSaveTransition] = useTransition();
  const [isRegenerating, startRegenTransition] = useTransition();
  const [isCambiandoEstado, startEstadoTransition] = useTransition();

  const suspendido = usuario.estado === "suspendido";

  function toggleModulo(slug: string) {
    setModulos((prev) => (prev.includes(slug) ? prev.filter((m) => m !== slug) : [...prev, slug]));
    setSaved(false);
  }

  function handleSave() {
    setError(null);
    startSaveTransition(async () => {
      const r = await updateUsuarioPermisos(usuario.id, { role, modulos_permitidos: modulos });
      if (r.error) { setError(r.error); return; }
      onUpdated({ ...usuario, role, modulos_permitidos: modulos });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  function handleRegenerarPassword() {
    setError(null);
    startRegenTransition(async () => {
      const r = await regenerarPassword(usuario.id);
      if (r.error || !r.data) { setError(r.error ?? "No se pudo regenerar la contraseña"); return; }
      onPasswordGenerated(r.data.passwordTemporal);
    });
  }

  function handleCambiarEstado() {
    setError(null);
    startEstadoTransition(async () => {
      const r = suspendido ? await reactivarUsuario(usuario.id) : await suspenderUsuario(usuario.id);
      if (r.error) { setError(r.error); setConfirmingEstado(false); return; }
      onUpdated({ ...usuario, estado: suspendido ? "activo" : "suspendido" });
      setConfirmingEstado(false);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto py-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Gestionar usuario ${usuario.nombre || usuario.email}`}
    >
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between rounded-t-xl">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">{usuario.nombre || usuario.email}</p>
            <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-gray-400 hover:text-gray-600 shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
              <Shield size={13} className="text-gray-400" />
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value as Role); setSaved(false); }}
              className="rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Módulos permitidos</p>
            <div className="grid grid-cols-2 gap-2">
              {MODULOS.map((m) => (
                <label key={m.slug} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modulos.includes(m.slug)}
                    onChange={() => toggleModulo(m.slug)}
                    className="rounded border-gray-300"
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="px-5 pb-3 text-xs text-red-600">{error}</p>}

        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl flex flex-wrap items-center justify-between gap-2">
          {confirmingEstado ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600">
                {suspendido ? "¿Reactivar este usuario?" : "¿Suspender este usuario?"}
              </span>
              <button
                type="button"
                onClick={handleCambiarEstado}
                disabled={isCambiandoEstado}
                className="px-2.5 py-1 rounded-lg text-white font-semibold disabled:opacity-50"
                style={{ backgroundColor: suspendido ? "#16a34a" : "#dc2626" }}
              >
                {isCambiandoEstado ? "Aplicando…" : suspendido ? "Sí, reactivar" : "Sí, suspender"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingEstado(false)}
                className="px-2.5 py-1 rounded-lg text-gray-600 border border-gray-200"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRegenerarPassword}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-azul-800 hover:bg-azul-50 transition-colors disabled:opacity-50"
              >
                <KeyRound size={13} />
                {isRegenerating ? "Generando…" : "Regenerar contraseña"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingEstado(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ color: suspendido ? "#16a34a" : "#dc2626" }}
              >
                {suspendido ? <RotateCcw size={13} /> : <Ban size={13} />}
                {suspendido ? "Reactivar" : "Suspender"}
              </button>
            </div>
          )}
          <SaveButton onClick={handleSave} isPending={isSaving} saved={saved} />
        </div>
      </div>
    </div>
  );
}

// ── Modal de contraseña generada ───────────────────────────────────

function PasswordModal({
  email,
  password,
  onClose,
}: {
  email: string;
  password: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Contraseña generada"
    >
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
        <h3 className="font-heading font-bold text-lg" style={{ color: "var(--color-azul-900)" }}>
          Contraseña generada
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Para <span className="font-semibold">{email}</span>. Cópiala ahora — no se volverá a mostrar.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <code className="flex-1 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono tracking-wide">
            {password}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copiar contraseña"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-white shrink-0"
            style={{ backgroundColor: copied ? "#16a34a" : "var(--color-azul-800)" }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Comparte esta contraseña de forma segura. Cuando se integre el envío por correo, este paso será automático.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--color-azul-800)" }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ── Subcomponentes reutilizables ──────────────────────────────────

function Field({
  label,
  icon,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
        {icon}
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
      />
    </div>
  );
}

function SaveButton({
  onClick,
  isPending,
  saved,
}: {
  onClick: () => void;
  isPending: boolean;
  saved: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50 transition-all"
      style={{ backgroundColor: saved ? "#16a34a" : "var(--color-azul-800)" }}
    >
      {saved ? (
        <>
          <CheckCircle2 size={13} />
          Guardado
        </>
      ) : (
        <>
          <Save size={13} />
          {isPending ? "Guardando…" : "Guardar"}
        </>
      )}
    </button>
  );
}
