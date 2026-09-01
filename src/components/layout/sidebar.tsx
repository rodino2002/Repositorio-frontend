import { ChevronDown } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { NavLink } from "react-router-dom"

import { useContext, useState } from "react"

// Define types for menu items
type SubMenuItem = {
  title: string;
  url: string;
  //icon: React.FC;
};

type MenuItem = {
  title: string;
  url: string;
  icon: React.FC;
  SubItem?: SubMenuItem[];
  roles: ("estudante" | "admin" | "avaliador" | "professor")[];
};

// Menu items.
const MenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: EstatisticasIcon,
    roles: ["estudante", "admin", "avaliador", "professor"],
  },
  {
    title: "Departamentos",
    url: "/departamentos",
    icon: DepartamentIcon,
    roles: ["estudante", "admin", "avaliador", "professor"],
  },
  {
    title: "Especialidades",
    url: "/especialidades",
    icon: EspecialidadeIcon,
    roles: ["estudante", "admin", "avaliador", "professor"],
  },
  {
    title: "Trabalhos",
    url: "/trabalhos",
    icon: TrabalhoIcon,
    roles: ["estudante", "admin", "avaliador"],
  },
  {
    title: "Gestão de Contas",
    url: "/gestao-de-contas",
    icon: GestaoDeContasIcon,
    roles: ["admin"],
  },
  {
    title: "Meu perfil",
    url: "/meu-perfil",
    icon: MeuPerfilIcon,
    roles: ["estudante", "admin", "avaliador", "professor"],
  },
];

import { ChevronRight } from "lucide-react"; // ícones bacanas
import { AuthContext } from "@/Context/auth.context";
import DepartamentIcon from "@/assets/sidebarIcons/departamentoIcon";
import EspecialidadeIcon from "@/assets/sidebarIcons/especialidadeIcon";
import GestaoDeContasIcon from "@/assets/sidebarIcons/GestaoDeContasIcon";
import TrabalhoIcon from "@/assets/sidebarIcons/trabalhoIcon";
import EstatisticasIcon from "@/assets/sidebarIcons/dashboardIcon";
import MeuPerfilIcon from "@/assets/sidebarIcons/meu-perfil";

export function AppSidebar() {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const anoAtual: number = new Date().getFullYear();
  const { user } = useContext(AuthContext)

  const userRole = String(user?.usuario?.role)?.toLocaleLowerCase() as "estudante" | "admin" | "avaliador" | "professor"

  const filteredMenuItems = MenuItems.filter((item) => item.roles.includes(userRole));

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title], // alterna aberto/fechado
    }));
  };

  return (
    <Sidebar className="text-sm flex text-[#0B1437]" >
      <SidebarHeader className="bg-[#ffffff] border-b-2 border-b-[#F4F7FE]">
        <nav className="flex items-center  justify-center h-[150px]">
          <NavLink to="/">
            <div className="flex justify-center w-full">
              <img src="/logo.png" className="w-30 h-30 animate-pulse" />
            </div>
          </NavLink>
        </nav>
      </SidebarHeader>

      <SidebarContent className="bg-[#ffffff] border-none shadow-[4px_8px_24px_0px_E7EAEF]">

        <SidebarGroup>

          <SidebarGroupContent>
            <SidebarMenu>

              {filteredMenuItems?.map((item) => (
                <SidebarMenuItem key={item?.title}>
                  {item.SubItem ? (
                    // Item com submenus
                    <>
                      <div
                        onClick={() => toggleMenu(item.title)}
                        className={`w-full h-14 p-4 rounded-lg flex items-center justify-between gap-2 cursor-pointer transition duration-300 ${openMenus[item.title]
                          ? "bg-[#FFF8E2] text-[#0B1437] font-semibold"
                          : "hover:text-[#0B1437] hover:bg-[#FFF8E2] font-semibold"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                        {openMenus[item.title] ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </div>

                      {openMenus[item.title] && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.SubItem.map((sub) => (
                            <NavLink key={sub.title} to={sub.url}>
                              {({ isActive }) => (
                                <div
                                  className={`w-full h-12 p-3 rounded-md flex items-center justify-start gap-2 transition duration-300 mt-1 ${isActive
                                    ? "bg-[#D4DAE7] text-[#0B1437] font-semibold"
                                    : "text-[#0B1437] bg-[#F4F7FE] hover:text-[#0B1437] hover:bg-[#e9ebf2]"
                                    }`}
                                >
                                  <span>- {sub.title}</span>
                                </div>
                              )}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Item sem submenu 
                    <NavLink to={item.url}>
                      {({ isActive }) => {
                        return (
                          <div
                            className={`w-full h-14 p-4 rounded-lg flex items-center gap-2 transition duration-300  ${isActive
                              ? "bg-[#FFF8E2] text-[#0B1437] font-semibold"
                              : "hover:text-[#0B1437] hover:bg-[#FFF8E2] font-semibold"
                              }`}
                          >
                            <div className={` ${isActive
                              ? " text-[#FF9500]"
                              : "hover:text-[#0B1437] "
                              }`} ><item.icon /></div>
                            <span>{item.title}</span>
                          </div>
                        )
                      }
                      }
                    </NavLink>
                  )}
                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>


        <div className="text-[12px] flex justify-between items-end p-4 px-6 text-[#C5C5C5] bottom-0 h-screen">
          <p className="flex">&copy; Copyright {anoAtual} - Repositório web académico</p>
          {/* <p className="flex pl-3">Vesão: {import.meta.env.VITE_APP_VERSION}</p> */}
        </div>

      </SidebarContent>
    </Sidebar>
  )
}
