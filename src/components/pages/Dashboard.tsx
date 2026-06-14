import { useQuery } from "@tanstack/react-query";
import { api } from "../config/api";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-secondary rounded-md p-4">
      <div className="text-xl mb-2">{icon}</div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-medium">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user-repo") || "{}");
  const nome = user?.usuario?.nome ?? "Utilizador";

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [trabalhos, utilizadores] = await Promise.all([
        api.get("/trabalhos/stats"),   // endpoint que retorna totais
        api.get("/utilizadores/stats"),
      ]);
      return { ...trabalhos.data, ...utilizadores.data };
    },
  });

  return (
    <div className="flex flex-col gap-6 p-5">

      <div>
        <p className="text-sm text-muted-foreground">Bom dia,</p>
        <p className="text-xl font-medium">{nome}</p>
      </div>

      {/* cards de totais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total de trabalhos" value={stats?.total ?? 0} icon="📄" />
        <StatCard label="Pendentes"           value={stats?.pendentes ?? 0} icon="⏳" />
        <StatCard label="Publicados"          value={stats?.publicados ?? 0} icon="✅" />
        <StatCard label="Utilizadores"        value={stats?.utilizadores ?? 0} icon="👥" />
      </div>

      {/* trabalhos recentes */}
      <div className="bg-white border rounded-lg p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Os meus trabalhos recentes
        </p>
        {/* tabela ou lista de trabalhos */}
      </div>

    </div>
  );
}