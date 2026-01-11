import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';

function App() {

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  //const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [tccs, setTccs] = useState<any[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: formData.username,
        senha: formData.password
      })

      if (response.status === 200) {
        setUser(response.data);
      }



    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      if (axios.isAxiosError(error)) {
        alert("Erro: " + error?.response?.data?.erro);
      } else {
        alert("Erro ao conectar com o servidor.");
      }

    } finally {
      setIsLoading(false);
    }

  }

  async function buscaTCC(e?: any ) {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/trabalhos',
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      )

      if (response.status === 200) {
        setTccs(response.data?.dados);
      }



    } catch (error) {
      console.error('Erro ao buscar tcc:', error);

      alert("Erro ao buscar tccs.");


    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    if (user) {
      buscaTCC();
    }
  }, [user]);

  return (
    <>
      <div className=''>
        <div className=' grid place-items-center h-screen'>
         {!user? <form className='w-[50%] ' onSubmit={handleSubmit}>
            <p className='flex justify-center w-full text-2xl font-bold'>Página de Login</p>
            <div className='flex flex-col space-y-2 mt-10'>
              <label className='text-start w-full font-semuibold text-zinc-700'>
                Usuário:
              </label>
              <input type="email" placeholder="Usuário"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="p-2 text-sm  ring-1 ring-zinc-200 focus:ring-zinc-500 duration-300 focus:outline-none w-full rounded-lg" />
            </div>
            <div className='flex flex-col space-y-2 mt-5'>
              <label className='text-start w-full font-semuibold text-zinc-700'>
                Password:
              </label>
              <input type="password" placeholder="Senha"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="p-2 text-sm ring-1 ring-zinc-200 focus:ring-zinc-500 duration-300 focus:outline-none  w-full rounded-lg" />
            </div>
            <button type="submit" disabled={isLoading}
              className="mt-10 w-full rounded-lg p-1 bg-blue-500 hover:bg-blue-700 duration-300 cursor-pointer text-white">
              {isLoading ? 'Carregando...' : 'Login'}
            </button>
          </form>:
          <div className='w-[80%]'>
            {tccs?.length > 0 && tccs?.map((tcc:any) => (
              <div key={tcc.id} className='mb-4 p-4 border border-zinc-300 rounded-lg'>
                <h2 className='text-xl font-bold mb-2'>{tcc.titulo}</h2>
                <p className='text-zinc-700 mb-1'><span className='font-semibold'>Autor:</span> {tcc.autor?.nome}</p>
                <p className='text-zinc-700 mb-1'><span className='font-semibold'>Ano:</span> {tcc.createdAt}</p>
                <p className='text-zinc-700'><span className='font-semibold'>Resumo:</span> {tcc.resumo}</p>
              </div>
            ))}
          </div>
          }
        </div>
      </div>
    </>
  )
}

export default App
