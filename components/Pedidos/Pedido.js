import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2'

const ACTUALIZAR_PEDIDO = gql`
    mutation ActualizarPedido($input: PedidoInput, $id: ID!) {
        actualizarPedido(input: $input, id: $id) {
            estatus
            id
  }
}
`

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!) {
        eliminarPedido(id: $id)
}
`

const OBTENER_PEDIDOS = gql`
query obtenerPedidosVendedor {
  obtenerPedidosVendedor {
    id
  }
}
`

const Pedido = ({ pedido }) => {

    const { id, total, estatus, cliente } = pedido;

    if(!cliente) return null;
    const { nombre, apellido, telefono, email} = cliente;

    // Mutation para cambiar el estatus de un pedido
    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO)
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
        refetchQueries: [
            { query: OBTENER_PEDIDOS },
            'obtenerPedidosVendedor'
        ]
    });

    console.log(pedido)

    const [estatusPedido, setEstatusPedido] = useState(estatus);
    const [clase, setClase] = useState('');

    useEffect(() => {
        if (estatusPedido) {
            setEstatusPedido(estatusPedido)
        }
        clasePedido();
    }, [estatusPedido]);

    // Función que modifica el color del pedido de acuerdo a su estado
    const clasePedido = () => {
        if (estatusPedido === 'PENDIENTE') {
            setClase('border-orange-500')
        } else if (estatusPedido === 'EN_ENVIO') {
            setClase('border-yellow-500')
        } else if (estatusPedido === 'COMPLETADO') {
            setClase('border-green-500')
        } else {
            setClase('border-red-800')
        }
    }

    const cambiarEstatusPedido = async nuevoEstatus => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id,
                    input: {
                        estatus: nuevoEstatus,
                        cliente: cliente.id
                    }
                }
            });

            setEstatusPedido(data.actualizarPedido.estatus)
        } catch (error) {
            console.log(error)
        }
    }

    const confirmarEliminarPedido = () => {
        Swal.fire({
            title: '¿Deseas eliminar a este pedido?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText: 'No, Cancelar'
        }).then(async (result) => {
            if (result.value) {
                try {
                    const data = await eliminarPedido({
                        variables: {
                            id
                        }
                    });

                    Swal.fire(
                        'Eliminado',
                        data.eliminarPedido,
                        'success'
                    );

                } catch (error) {
                    console.log(error)
                }

            }
        })
    }

    return (
        <div className={` ${clase} border-l-8 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className='font-bold text-gray-800'>Cliente: {nombre} {apellido}</p>

                {email && (
                    <p className='flex items-center my-2'>
                        <span className="material-symbols-outlined px-2"> email </span>
                        {email}
                    </p>
                )}

                {telefono && (
                    <p className='flex items-center my-2'>
                        <span className="material-symbols-outlined px-2"> phone </span>
                        {telefono}
                    </p>
                )}

                <h2 className='text-gray-800 font-bold mt-10'>Estatus Pedido: {estatus}</h2>
                <select
                    className='mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:oultine-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold'
                    value={estatusPedido}
                    onChange={e => cambiarEstatusPedido(e.target.value)}
                > 

                    <option value='EN_ENVIO'>EN_ENVIO</option>
                    <option value='PENDIENTE'>PENDIENTE</option>
                    <option value='PENDIENTE'>PENDIENTE</option>
                    <option value='COMPLETADO'>COMPLETADO</option>
                    <option value='CANCELADO'>CANCELADO</option>
                </select>
            </div>

            <div>
                <h2 className='text-gray-800 font-bold mt-2'>Resumen del Pedido</h2>
                {pedido.pedido.map(articulo => (
                    <div key={articulo.id} className='mt-4'>
                        <p className='text-sm text-gray-600'>Producto: {articulo.nombre} </p>
                        <p className='text-sm text-gray-600'>Cantidad: {articulo.cantidad} </p>
                    </div>
                ))}

                <p className='text-gray-800 mt-3 font-bold'>Total a pagar:
                    <span className='font-light'> $ {total}</span>
                </p>
                <button className='uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 text-white rounded leading-tight'
                    onClick={() => confirmarEliminarPedido(id)}
                >
                    Eliminar Pedido
                    <span className="material-symbols-outlined px-2"> delete </span>
                </button>
            </div>
        </div>
    )
}

export default Pedido