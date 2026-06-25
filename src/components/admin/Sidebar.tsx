import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/paginas", label: "Páginas" },
  { href: "/servicios", label: "Servicios" },
  { href: "/equipo", label: "Equipo" },
  { href: "/normativa", label: "Normativa" },
  { href: "/pqrs", label: "PQRS" },
  { href: "/usuarios", label: "Usuarios" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-6 text-lg font-bold border-b border-blue-800">
        Panel Admin
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={`/admin${item.href}`}
                className="block rounded px-3 py-2 text-sm hover:bg-blue-800 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-blue-800 text-sm text-blue-300">
        Cardiocentro Pediátrico
      </div>
    </aside>
  );
}
