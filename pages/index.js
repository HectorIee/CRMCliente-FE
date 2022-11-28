import Layout from '../components/Layout'
import Cliente from '../components/Clientes/Cliente';
import React from 'react'
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
        id
        nombre
        apellido
        empresa
        email
    }
  }
`;

const Index = () => {
  const router = useRouter();

  // Apollo consult
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO)

  console.log(data)
  console.log(loading)
  console.log(error)

  if (loading) return ('Cargandoo...');

  if (!data.obtenerClientesVendedor) {
    return router.push('./Access/login');
  }

  return (
    <div>
      <Layout>
        <h1 className="text-3xl text-gray-800 font-light">Clientes</h1>
        <Link href='/Clientes/nuevocliente' className='bg-blue-800 py-3 px-3 mt-5 inline-block text-white rounded text-md hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center'>
          Nuevo Cliente
        </Link>

      <div className='overflow-x-scroll lg:overflow-hidden'>

        <table className='table-auto shadow-md mt-10 w-full w-lg'>
          <thead className='bg-gray-800'>
            <tr className='text-white'>
              <th className='w-1/5 py-2 text-md'>Nombre</th>
              <th className='w-1/5 py-2 text-md'>Empresa</th>
              <th className='w-1/5 py-2 text-md'>Email</th>
              <th className='w-1/5 py-2 text-md'>Borrar</th>
              <th className='w-1/5 py-2 text-md'>Editar</th>
            </tr>
          </thead>

          <tbody className='bg-white'>
            {data.obtenerClientesVendedor.map(cliente => (
              <Cliente
                key={cliente.id}
                cliente={cliente}
              />
            ))}
          </tbody>
        </table>
      </div>

      </Layout>
    </div>
  );
};

export default Index;
