import React, { useContext, useState } from 'react'
import Layout from '../../components/Layout'
import AsignarCliente from '../../components/Pedidos/AsignarCliente'
import AsignarProductos from '../../components/Pedidos/AsignarProductos'
import ResumenPedido from '../../components/Pedidos/ResumenPedido'
import Total from '../../components/Pedidos/Total'
import { gql, useMutation } from '@apollo/client'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'


//Context de pedidos
import PedidoContext from '../../context/pedidos/PedidoContext'


const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput){
        nuevoPedido(input: $input) {
            id
        }
    }
`;

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
      obtenerPedidosVendedor {
        id
        pedido {
          id
          cantidad
          nombre
        }
        cliente {
          id
          nombre
          apellido
          email
          telefono
        }
        vendedor
        total
        estado
      }
  }
`

const OBTENER_PRODUCTOS = gql`
query ObtenerProductos {
    obtenerProductos {
        id
        nombre
        precio
        existencia
    }
}
`;


const nuevopedido = () => {
  const [mensaje, setMensaje] = useState(null);

  const router = useRouter();

  //Utilizar context y extrar sus funciones y valores 
  const pedidoContext = useContext(PedidoContext);
  const { cliente, productos, total } = pedidoContext;


  //mutation
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    refetchQueries: [
      { query: OBTENER_PEDIDOS },
      { query: OBTENER_PRODUCTOS },
      'obtenerProductos',
      'obtenerPedidosVendedor'
    ]
  });

  const validarPedido = () => {
    return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? "opacity-50 cursor-not-allowed" : "";
  }

  const crearNuevoPedido = async () => {
    const { id } = cliente
    //Remover lo no desado de productos
    const pedido = productos.map(({ existencia, __typename, ...producto }) => producto)

    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido
          }
        }
      })
      console.log(data)

      //Mostrar Alerta
      Swal.fire(
        'Realizado!',
        'El pedido se realizo',
        'success'
      )

      //Redigir
      router.push('./pedidos')


    } catch (error) {
      setMensaje(error.message.replace('GraphQL error: ', ''));

      setTimeout(() => {
        setMensaje(null)
      }, 3000);
    }
  }

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-md text-center mx-auto'>
        <p>{mensaje}</p>
      </div>
    )
  }

  const Regresar = () => {
    router.push('/Pedidos/pedidos')
  }

  return (
    <Layout>
      {mensaje && mostrarMensaje()}
      <h1 className='text-2xl text-gray-800 font-light'>Nuevo Pedido</h1>

      <div className='sm:flex mt-10 sm:w-1/6'>
        <button className='flex justify-center items-center bg-red-700 py-2 w-full text-white rounded text-base uppercase font-bold'
          type='button' onClick={() => Regresar()}>
          REGRESAR
          <span className="material-symbols-outlined px-2"> reply </span>
        </button>
      </div>

      <div className='flex justify-center mt-5 '>
        <div className='w-full max-w-2xl'>
          <AsignarCliente />
          <AsignarProductos />
          <ResumenPedido />
          <Total />

          <button className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold rounded-md hover:bg-gray-900 ${validarPedido()}`}
            type='button' onClick={() => crearNuevoPedido()}>
            Registrar Pedido
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default nuevopedido