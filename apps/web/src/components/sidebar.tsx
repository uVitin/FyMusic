"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";

// Sidebar do desktop (escondida no mobile, onde usamos a barra inferior)
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-2 bg-black p-2 lg:flex">
      <div className="px-4 py-4 text-2xl font-bold">
        <span className="text-primary">Fy</span>Music
      </div>

      <nav className="flex flex-col gap-1 rounded-lg bg-[#121212] p-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 rounded-md px-3 py-2 text-sm font-semibold transition ${
                active ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon size={22} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}