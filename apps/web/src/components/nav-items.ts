import { Home, Search, Library, type LucideIcon } from "lucide-react";

// Itens de navegação compartilhados pela sidebar (desktop) e a barra inferior (mobile)
export const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/library", label: "Sua Biblioteca", icon: Library },
];