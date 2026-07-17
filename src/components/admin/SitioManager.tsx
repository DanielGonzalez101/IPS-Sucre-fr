"use client";

import { useState, useTransition } from "react";
import { MapPin, Phone, Mail, Clock, Link2, Save, CheckCircle2, MessageCircle, ChevronDown, Trash2, Plus, X } from "lucide-react";
import { updateSede, updateEmailContacto, updateRedesSociales, createSede, deleteSede } from "@/actions/sitio";
import type { Sede, RedesSociales } from "@/actions/sitio";

interface Props {
  sedes: Sede[];
  emailContacto: string;
  redes: RedesSociales;
}

export function SitioManager({ sedes: initialSedes, emailContacto: initialEmail, redes }: Props) {
  const [sedes, setSedes] = useState(initialSedes);

  return (
    <div className="space-y-6">
      <EmailCard initialEmail={initialEmail} />
      <RedesCard initialRedes={redes} />
      <div className="space-y-3">
        {sedes.map((sede) => (
          <SedeCard
            key={sede.id}
            sede={sede}
            onDeleted={() => setSedes((prev) => prev.filter((s) => s.id !== sede.id))}
          />
        ))}
        <NuevaSedeCard onCreated={(sede) => setSedes((prev) => [...prev, sede])} />
      </div>
    </div>
  );
}

// ── Email de contacto ─────────────────────────────────────────────

function EmailCard({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!email.trim()) { setError("El email es obligatorio"); return; }
    setError(null);
    startTransition(async () => {
      const r = await updateEmailContacto(email);
      if (r.error) { setError(r.error); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <Mail size={15} className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">Email de contacto</span>
      </div>
      <div className="p-5 flex gap-3 items-start">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setSaved(false); }}
          placeholder="info@ejemplo.com"
          className="flex-1 rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
        />
        <SaveButton
          onClick={handleSave}
          isPending={isPending}
          saved={saved}
        />
      </div>
      {error && <p className="px-5 pb-4 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Redes sociales ────────────────────────────────────────────────

function RedesCard({ initialRedes }: { initialRedes: RedesSociales }) {
  const [redes, setRedes] = useState(initialRedes);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set(key: keyof RedesSociales) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setRedes((prev) => ({ ...prev, [key]: e.target.value }));
      setSaved(false);
    };
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const r = await updateRedesSociales(redes);
      if (r.error) { setError(r.error); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 size={15} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Redes sociales</span>
        </div>
        <SaveButton onClick={handleSave} isPending={isPending} saved={saved} />
      </div>
      <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field
          label="Facebook"
          icon={<Link2 size={13} className="text-gray-400" />}
          value={redes.facebook_url}
          onChange={set("facebook_url")}
          placeholder="https://www.facebook.com/cardiocentro"
        />
        <Field
          label="Instagram"
          icon={<Link2 size={13} className="text-gray-400" />}
          value={redes.instagram_url}
          onChange={set("instagram_url")}
          placeholder="https://www.instagram.com/cardiocentro"
        />
        <Field
          label="WhatsApp"
          icon={<MessageCircle size={13} className="text-gray-400" />}
          value={redes.whatsapp_url}
          onChange={set("whatsapp_url")}
          placeholder="https://wa.me/573009127565"
        />
      </div>
      {error && <p className="px-5 pb-4 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ── Card por sede (colapsable) ──────────────────────────────────────

function SedeCard({ sede, onDeleted }: { sede: Sede; onDeleted: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [fields, setFields] = useState({
    ciudad: sede.ciudad,
    direccion: sede.direccion,
    telefono: sede.telefono,
    horario: sede.horario,
    map_url: sede.map_url,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      setSaved(false);
    };
  }

  function handleSave() {
    if (!fields.ciudad.trim() || !fields.direccion.trim()) {
      setError("Ciudad y dirección son obligatorias");
      return;
    }
    setError(null);
    startTransition(async () => {
      const r = await updateSede(sede.id, fields);
      if (r.error) { setError(r.error); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      const r = await deleteSede(sede.id);
      if (r.error) { setError(r.error); setConfirmingDelete(false); return; }
      onDeleted();
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header — siempre visible, controla el colapso */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="w-full px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Sede — {sede.ciudad}</span>
          {!fields.map_url && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Sin mapa
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Campos — solo si está expandida */}
      {expanded && (
        <>
          <div className="p-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Ciudad"
              icon={<MapPin size={13} className="text-gray-400" />}
              value={fields.ciudad}
              onChange={set("ciudad")}
              placeholder="Ej: Sincelejo"
            />
            <Field
              label="Teléfono"
              icon={<Phone size={13} className="text-gray-400" />}
              value={fields.telefono}
              onChange={set("telefono")}
              placeholder="(+57) 300 912 7565"
            />
            <Field
              label="Dirección"
              icon={<MapPin size={13} className="text-gray-400" />}
              value={fields.direccion}
              onChange={set("direccion")}
              placeholder="Calle 14 No. 17-72 / Barrio Ford"
              className="md:col-span-2"
            />
            <div className={`flex flex-col gap-1 md:col-span-2`}>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <Clock size={13} className="text-gray-400" />
                Horario
              </label>
              <textarea
                value={fields.horario}
                onChange={set("horario")}
                rows={2}
                placeholder={"L–V 7:00 a.m.–12:00 m. / 1:00–6:00 p.m.\nSáb 7:00–11:00 a.m."}
                className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
              />
              <p className="text-xs text-gray-400">Usa salto de línea para separar horarios.</p>
            </div>
            <Field
              label="URL del mapa (Google Maps embed)"
              icon={<Link2 size={13} className="text-gray-400" />}
              value={fields.map_url}
              onChange={set("map_url")}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="md:col-span-2"
            />
          </div>

          {error && (
            <p className="px-5 pb-3 text-xs text-red-600">{error}</p>
          )}

          {/* Acciones */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            {confirmingDelete ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600">¿Eliminar esta sede?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-2.5 py-1 rounded-lg text-white font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  {isDeleting ? "Eliminando…" : "Sí, eliminar"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="px-2.5 py-1 rounded-lg text-gray-600 border border-gray-200"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={13} />
                Eliminar sede
              </button>
            )}
            <SaveButton onClick={handleSave} isPending={isPending} saved={saved} />
          </div>
        </>
      )}
    </div>
  );
}

// ── Nueva sede ────────────────────────────────────────────────────

function NuevaSedeCard({ onCreated }: { onCreated: (sede: Sede) => void }) {
  const [open, setOpen] = useState(false);
  const [ciudad, setCiudad] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    if (!ciudad.trim()) { setError("Escribe el nombre de la ciudad"); return; }
    setError(null);
    startTransition(async () => {
      const r = await createSede(ciudad.trim());
      if (r.error || !r.data) { setError(r.error ?? "No se pudo crear la sede"); return; }
      onCreated(r.data);
      setCiudad("");
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
        <Plus size={15} />
        Nueva sede
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Nueva sede</span>
        <button
          type="button"
          onClick={() => { setOpen(false); setCiudad(""); setError(null); }}
          aria-label="Cancelar"
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
      <div className="p-5 flex gap-3 items-start">
        <input
          type="text"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Nombre de la ciudad, ej: La Fe"
          className="flex-1 rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: "var(--color-azul-800)" }}
        >
          <Plus size={13} />
          {isPending ? "Creando…" : "Crear sede"}
        </button>
      </div>
      {error && <p className="px-5 pb-4 text-xs text-red-600">{error}</p>}
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
      style={{
        backgroundColor: saved ? "#16a34a" : "var(--color-azul-800)",
      }}
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
