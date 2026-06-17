import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Estamos num monorepo (npm workspaces). Apontar a raiz do Turbopack
  // para a raiz do projeto evita o aviso de "múltiplos lockfiles".
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  // Libera o domínio das capas da Deezer para o componente next/image
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn-images.dzcdn.net" },
    ],
  },
};

export default nextConfig;