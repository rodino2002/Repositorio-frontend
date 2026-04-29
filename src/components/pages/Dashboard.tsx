
export default function Dashboard() {
  const User = localStorage.getItem("user-repo")
  const userParsed = User ? JSON.parse(User) : null
  return (
    <>
      <div className=' bg-white rounded-lg h-fit text-sm flex flex-col p-5 '>
        Página de Dashboard
        {User && <p>Usuário logado: {userParsed?.usuario?.nome}</p>}
      </div>
    </>
  )
}

