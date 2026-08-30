import { useState } from "react";

export function UserAvatar({ photo }: { photo?: string | null }) {
  const [onErrorImg, setOnErrorImg] = useState(false);

  const mostrarImagem = photo && !onErrorImg;

  return mostrarImagem ? (
    <img
      src={photo}
      className="rounded-full h-full object-cover"
      onError={() => setOnErrorImg(true)}
      alt="Foto do usuário"
    />
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" className="lucide lucide-user-icon lucide-user text-zinc-400">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}