import React from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import Pedido from '../../components/Pedidos/Pedido';

const OBTENER_PEDIDOS = gql`
    query obtenerPedidosVendedor {
  obtenerPedidosVendedor {
    id
    cliente {
      apellido
      email
      empresa
      id
      nombre
      telefono
      vendedor
    }
     pedido {
      cantidad
      id
      nombre
      precio
    }
    estatus
    total
    vendedor
   
  }
}
`;

const Pedidos = () => {
  const { data, loading, error } = useQuery(OBTENER_PEDIDOS);

  if (loading) return 'Cargando...'

  const { obtenerPedidosVendedor } = data;

  console.log(data)
  console.log(loading)
  console.log(error)

  return (
    <div>
      <Layout>
        <h1 className=' text-2xl text-gray-800 font-light'>Pedidos</h1>
        <Link href='/Pedidos/nuevopedido' className='bg-blue-800 py-3 px-5 mt-5 inline-block text-white rounded text-md hover:bg-gray-800 mb-3 uppercase font-bold'>
          NUEVO PEDIDO
        </Link>

        {obtenerPedidosVendedor.length === 0 ? (
          <p className='mt-5 text-center text-2xl'> No hay pedidos aún </p>
        ): (
            obtenerPedidosVendedor.map( pedido => (
              <Pedido
                key={pedido.id}
                pedido={pedido}
              />
            ))
          )}
      </Layout>
    </div>
  )
}

export default Pedidos