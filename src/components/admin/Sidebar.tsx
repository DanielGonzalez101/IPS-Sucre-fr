"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Heart,
  Users,
  BookOpen,
  MessageSquare,
  UserCircle,
  LogOut,
  Home,
  ChevronDown,
  SlidersHorizontal,
  UserRound,
  Cpu,
  Settings,
  Newspaper,
} from "lucide-react";
import { signOut } from "@/actions/auth";

// Grupos colapsables con subcategorías. El campo `slug` debe coincidir con
// src/lib/permisos.ts para que el filtrado por permisos funcione.
const navGroups = [
  {
    key: "pagina-principal",
    label: "Página principal",
    Icon: Home,
    children: [
      { href: "/hero", slug: "hero", label: "Carrusel", Icon: SlidersHorizontal },
    ],
  },
  {
    key: "equipo",
    label: "Equipo",
    Icon: Users,
    children: [
      { href: "/equipo/humano",      slug: "equipo-humano",      label: "Equipo humano",      Icon: UserRound },
      { href: "/equipo/tecnologico", slug: "equipo-tecnologico", label: "Equipo tecnológico", Icon: Cpu       },
    ],
  },
];

// Items planos sin subcategorías
const navItems = [
  { href: "/dashboard",  slug: "dashboard", label: "Dashboard",      Icon: LayoutDashboard },
  { href: "/paginas",    slug: "paginas",   label: "Páginas",         Icon: FileText       },
  { href: "/servicios",  slug: "servicios", label: "Servicios",       Icon: Heart          },
  { href: "/noticias",   slug: "noticias",  label: "Noticias",        Icon: Newspaper      },
  { href: "/normativa",  slug: "normativa", label: "Normativa",       Icon: BookOpen       },
  { href: "/pqrs",       slug: "pqrs",      label: "PQRS",            Icon: MessageSquare  },
  { href: "/usuarios",   slug: "usuarios",  label: "Usuarios",        Icon: UserCircle     },
  { href: "/sitio",      slug: "sitio",     label: "Datos del sitio", Icon: Settings       },
];

interface SidebarProps {
  modulosPermitidos: string[];
}

export default function Sidebar({ modulosPermitidos }: SidebarProps) {
  const pathname = usePathname();

  const navItemsVisibles = navItems.filter(
    (item) => item.slug === "dashboard" || modulosPermitidos.includes(item.slug)
  );
  const navGroupsVisibles = navGroups
    .map((group) => ({
      ...group,
      children: group.children.filter((child) => modulosPermitidos.includes(child.slug)),
    }))
    .filter((group) => group.children.length > 0);

  // Determinar qué grupos tienen un hijo activo para auto-expandirlos
  const defaultOpen = navGroupsVisibles
    .filter((g) =>
      g.children.some((c) => {
        const full = `/gestion-interna${c.href}`;
        return pathname === full || pathname.startsWith(full + "/");
      })
    )
    .map((g) => g.key);

  const [openGroups, setOpenGroups] = useState<string[]>(defaultOpen);

  // Si la ruta cambia y el grupo padre no está abierto, abrirlo automáticamente
  useEffect(() => {
    navGroupsVisibles.forEach((g) => {
      const hasActive = g.children.some((c) => {
        const full = `/gestion-interna${c.href}`;
        return pathname === full || pathname.startsWith(full + "/");
      });
      if (hasActive) {
        setOpenGroups((prev) =>
          prev.includes(g.key) ? prev : [...prev, g.key]
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function toggleGroup(key: string) {
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  return (
    <aside
      className="w-64 flex flex-col shrink-0 h-screen sticky top-0"
      style={{ backgroundColor: "var(--color-azul-900)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Image
          src="/logo.png"
          alt="Cardiocentro Pediátrico de Sucre"
          width={36}
          height={36}
          className="shrink-0"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <div>
          <p className="font-heading font-bold text-sm text-white leading-tight">
            Cardiocentro
          </p>
          <p className="font-body text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            Panel administrativo
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p
          className="font-heading font-semibold text-xs uppercase tracking-widest px-3 mb-3"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Menú
        </p>
        <ul className="space-y-0.5">

          {/* Dashboard siempre primero */}
          {navItemsVisibles.slice(0, 1).map(({ href, label, Icon }) => {
            const full = `/gestion-interna${href}`;
            const isActive = pathname === full || pathname.startsWith(full + "/");
            return (
              <li key={href}>
                <NavLink href={full} label={label} Icon={Icon} isActive={isActive} />
              </li>
            );
          })}

          {/* Grupos colapsables */}
          {navGroupsVisibles.map((group) => {
            const isOpen = openGroups.includes(group.key);
            const hasActiveChild = group.children.some((c) => {
              const full = `/gestion-interna${c.href}`;
              return pathname === full || pathname.startsWith(full + "/");
            });

            return (
              <li key={group.key}>
                {/* Botón del grupo */}
                <button
                  onClick={() => toggleGroup(group.key)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{
                    color: hasActiveChild ? "#fff" : "rgba(255,255,255,0.60)",
                    backgroundColor: hasActiveChild
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!hasActiveChild)
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!hasActiveChild)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <group.Icon
                    size={18}
                    strokeWidth={hasActiveChild ? 2.5 : 1.75}
                    style={{
                      color: hasActiveChild ? "var(--color-rojo-400)" : "inherit",
                      flexShrink: 0,
                    }}
                  />
                  <span className="flex-1 text-left">{group.label}</span>
                  <ChevronDown
                    size={15}
                    style={{
                      color: "rgba(255,255,255,0.40)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {/* Subcategorías */}
                {isOpen && (
                  <ul className="mt-0.5 ml-3 space-y-0.5">
                    {group.children.map((child) => {
                      const full = `/gestion-interna${child.href}`;
                      const isActive =
                        pathname === full || pathname.startsWith(full + "/");
                      return (
                        <li key={child.href}>
                          <Link
                            href={full}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                            style={{
                              color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
                              backgroundColor: isActive
                                ? "rgba(255,255,255,0.10)"
                                : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive)
                                e.currentTarget.style.backgroundColor =
                                  "rgba(255,255,255,0.06)";
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive)
                                e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            <child.Icon
                              size={15}
                              strokeWidth={isActive ? 2.5 : 1.75}
                              style={{
                                color: isActive
                                  ? "var(--color-rojo-400)"
                                  : "inherit",
                                flexShrink: 0,
                              }}
                            />
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}

          {/* Resto de items planos */}
          {navItemsVisibles.slice(1).map(({ href, label, Icon }) => {
            const full = `/gestion-interna${href}`;
            const isActive = pathname === full || pathname.startsWith(full + "/");
            return (
              <li key={href}>
                <NavLink href={full} label={label} Icon={Icon} isActive={isActive} />
              </li>
            );
          })}

        </ul>
      </nav>

      {/* Footer — cerrar sesión */}
      <div
        className="px-3 py-4 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{ color: "rgba(255,255,255,0.50)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.50)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

// Componente reutilizable para items planos
function NavLink({
  href,
  label,
  Icon,
  isActive,
}: {
  href: string;
  label: string;
  Icon: React.ElementType;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
      style={{
        color: isActive ? "#fff" : "rgba(255,255,255,0.60)",
        backgroundColor: isActive ? "rgba(255,255,255,0.10)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive)
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Icon
        size={18}
        strokeWidth={isActive ? 2.5 : 1.75}
        style={{
          color: isActive ? "var(--color-rojo-400)" : "inherit",
          flexShrink: 0,
        }}
      />
      {label}
      {isActive && (
        <span
          className="ml-auto w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "var(--color-rojo-400)" }}
        />
      )}
    </Link>
  );
}