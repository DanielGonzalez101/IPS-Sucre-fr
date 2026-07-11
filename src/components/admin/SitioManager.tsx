"use client";

import { useState, useTransition } from "react";
import { MapPin, Phone, Mail, Clock, Link2, Save, CheckCircle2, MessageCircle } from "lucide-react";
import { updateSede, updateEmailContacto, updateRedesSociales } from "@/actions/sitio";
import type { Sede, RedesSociales } from "@/actions/sitio";

interface Props {
  sedes: Sede[];
  emailContacto: string;
  redes: RedesSociales;
}

export function SitioManager({ sedes: initialSedes, emailContacto: initialEmail, redes }: Props) {
  return (
    <div className="space-y-6">
      <EmailCard initialEmail={initialEmail} />
      <RedesCard initialRedes={redes} />
      {initialSedes.map((sede) => (
        <SedeCard key={sede.id} sede={sede} />
      ))}
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

// ── Card por sede ─────────────────────────────────────────────────

function SedeCard({ sede }: { sede: Sede }) {
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Sede — {sede.ciudad}</span>
        </div>
        <SaveButton onClick={handleSave} isPending={isPending} saved={saved} />
      </div>

      {/* Campos */}
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
        <p className="px-5 pb-4 text-xs text-red-600 bg-red-50 border-t border-red-100 py-2">
          {error}
        </p>
      )}
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
