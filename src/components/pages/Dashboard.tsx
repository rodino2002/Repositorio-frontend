import { useQuery } from "@tanstack/react-query";
import { api } from "../config/api";
import type { ReactNode } from "react";

import {
  FileText,
  Clock3,
  RefreshCw,
  CheckCircle2,
  Globe2,
  Users,
} from "lucide-react";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
};

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>

      <p className="mb-1 text-xs text-muted-foreground">
        {label}
      </p>

      <p className="text-2xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("user-repo") || "{}"
  );

  const nome = user?.usuario?.nome ?? "Utilizador";

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],

    queryFn: async () => {
      const response = await api.get("/dashboard/cards");

      return response.data.dados;
    },
  });

  return (
    <div className="flex flex-col gap-6 p-5">

      {/* CABEÇALHO */}
      <div>
        <p className="text-sm text-muted-foreground">
          Bom dia,
        </p>

        <p className="text-xl font-medium">
          {nome}
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">

        <StatCard
          label="Total de trabalhos"
          value={isLoading ? 0 : stats?.totalTrabalhos ?? 0}
          icon={<FileText className="h-5 w-5" />}
        />

        <StatCard
          label="Pendentes"
          value={isLoading ? 0 : stats?.pendentes ?? 0}
          icon={<Clock3 className="h-5 w-5" />}
        />

        <StatCard
          label="Recusado"
          value={isLoading ? 0 : stats?.recusado ?? 0}
          icon={<RefreshCw className="h-5 w-5" />}
        />

        <StatCard
          label="Aprovados"
          value={isLoading ? 0 : stats?.aprovados ?? 0}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <StatCard
          label="Publicados"
          value={isLoading ? 0 : stats?.publicados ?? 0}
          icon={<Globe2 className="h-5 w-5" />}
        />

        <StatCard
          label="Utilizadores"
          value={isLoading ? 0 : stats?.utilizadores ?? 0}
          icon={<Users className="h-5 w-5" />}
        />

      </div>

      {/* TRABALHOS RECENTES */}
      <div className="rounded-lg border bg-white p-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Trabalhos recentes
        </p>

        {/* tabela ou lista de trabalhos */}
      </div>

    </div>
  );
}