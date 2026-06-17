"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";

// Barra de navegação inferior (apenas no mobile)
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 items-center justify-around border-t border-neutral-800 bg-black py-2 lg:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition ${
              active ? "text-white" : "text-neutral-400"
            }`}
          >
            <Icon size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}