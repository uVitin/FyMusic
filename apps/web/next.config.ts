import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Estamos num monorepo (npm workspaces). Apontar a raiz do Turbopack
  // para a raiz do projeto evita o aviso de "múltiplos lockfiles".
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;