import React from 'react'
import Swal from 'sweetalert2'
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';

const ELIMINAR_CLIENTE = gql`
mutation EliminarCliente($id: ID!) {
  eliminarCliente(id: $id)
}
`
    ;

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
`
    ;

const Cliente = ({ cliente }) => {

    // mutation para eliminar cliente
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        refetchQueries:[
            {query: OBTENER_CLIENTES_USUARIO},
            'obtenerClientesVendedor'
        ]
    });

    const { nombre, apellido, empresa, email, id } = cliente;

    // Delete a client
    const confirmarEliminarCliente = id => {
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
                    // Eliminate by id
                    const { data } = await eliminarCliente({
                        variables: {
                            id
                        }
                    });
                    // muestra la alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    const editarCliente = () => {
        Router.push({
            pathname: "/Clientes/editarcliente/[id]",
            query: { id }
        })
    }

    return (
        <tr>
            <td className='border px-4 py-2'>{nombre} {apellido} </td>
            <td className='border px-4 py-2'>{empresa} </td>
            <td className='border px-4 py-2'>{email} </td>

            <td className='border px-4 py-2'>
                <button className='flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-base uppercase font-bold'
                    type='button' onClick={() => confirmarEliminarCliente(id)} >
                    ELIMINAR
                    <span className="material-symbols-outlined px-2"> delete </span>
                </button>
            </td>

            <td className='border px-4 py-2'>
                <button className='flex justify-center items-center bg-green-700 py-2 px-4 w-full text-white rounded text-base uppercase font-bold'
                    type='button' onClick={() => editarCliente()} >
                    EDITAR
                    <span className="material-symbols-outlined px-2"> edit </span>
                </button>
            </td>
        </tr>
    )
}

export default Cliente;