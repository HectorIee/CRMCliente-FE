import React from 'react'
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import Swal from 'sweetalert2'


const ELIMINAR_PRODUCTO = gql`
mutation eliminarProducto($id: ID!) {
  eliminarProducto(id: $id)
}
`;

const OBTENER_PRODUCTOS = gql`
query obtenerProductos {
    obtenerProductos {
        id
        nombre
        precio
        existencia
    }
}
`;

const Producto = ({ producto }) => {
    const { nombre, precio, existencia, id } = producto;

    // Mutation para eliminar productos 
    const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO, {
        refetchQueries: [ 
          { query: OBTENER_PRODUCTOS },
          'obtenerProductos'
        ]
      });

    const confirmarEliminarProducto = () => {
        Swal.fire({
            title: 'Estas Seguro?',
            text: "Esta accion no es revercible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Hazlo!'
        }).then(async (result) => {
            if (result.value) {
                try {
                    // Elimar del BD productos
                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    });
                    Swal.fire(
                        'Eliminado',
                        data.eliminarProducto,
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    const editarProducto = () => {
        Router.push({
            pathname: '/Productos/editarproducto/[id]',
            query: { id }
        })
    }

    return (
        <tr>
            <td className='border px-4 py-2'>{nombre}</td>
            <td className='border px-4 py-2'>{existencia} Piezas</td>
            <td className='border px-4 py-2'>$ {precio} MXN</td>
            <td className='border px-4 py-2'>
                <button className='flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-base uppercase font-bold'
                    type='button'onClick={() => confirmarEliminarProducto(id)} >
                    ELIMINAR
                    <span className="material-symbols-outlined px-2"> delete </span>
                </button>
            </td>

            <td className='border px-4 py-2'>
                <button className='flex justify-center items-center bg-green-700 py-2 px-4 w-full text-white rounded text-base uppercase font-bold'
                    type='button' onClick={() => editarProducto()} >
                    EDITAR
                    <span className="material-symbols-outlined px-2"> edit </span>
                </button>
            </td>
        </tr>
    );
}

export default Producto