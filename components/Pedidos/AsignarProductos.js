import React, { useEffect, useState, useContext } from "react";
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client'
import PedidoContext from "../../context/pedidos/PedidoContext";


const OBTENER_PRODUCTOS = gql`
    query obtenerProductos {
        obtenerProductos{
            id
            nombre
            precio
            existencia
        }
    }
`;

const AsignarProductos = () => {
    //State local 
    const [productos, setProductos] = useState([]);

    //context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;

    useEffect(() => {
        agregarProducto(productos);
    }, [productos])

    //Consulta a la BD
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    const selectProducto = producto => {
        setProductos(producto)
    }

    if (loading) return null
    const { obtenerProductos } = data;

    return (
        <>
            <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-md font-bold'>2.- Asignar los productos</p>

            <Select className='mt-3'
                options={obtenerProductos} isMulti={true}
                onChange={(opcion) => selectProducto(opcion)}
                placeholder="Seleccione el cliente" noOptionsMessage={() => "No hay resultados"}
                getOptionLabel={(opciones) => `${opciones.nombre} - ${opciones.existencia} Disponibles`} getOptionValue={(opciones) => opciones.id} />
        </>
    )
}

export default AsignarProductos