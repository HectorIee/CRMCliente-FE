import React, { useEffect, useState,useContext } from 'react'
import Select from 'react-select'
import {gql, useQuery} from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext';


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

const AsignarCliente = () => {
  const [cliente, setCliente] = useState([]);

  //context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const {agregarCliente} = pedidoContext;

  //Consultar BD
  const {data, loading, error} = useQuery(OBTENER_CLIENTES_USUARIO)

  useEffect(() => {
   agregarCliente(cliente)
  }, [cliente])

  const selectCliente = clientes => {
    setCliente(clientes);
  }

  if(loading) return null

  const {obtenerClientesVendedor} = data

  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-md font-bold'>1.- Asignar un Cliente al pedido</p>

      <Select className='mt-3' 
        options={obtenerClientesVendedor}
        onChange={(opcion) => selectCliente(opcion)}
        placeholder="Seleccione el cliente" noOptionsMessage={() => "No hay resultados"}
        getOptionLabel={(opciones) => `${opciones.nombre} ${opciones.apellido}`} getOptionValue={(opciones) => opciones.id} />
    </>
  )
}

export default AsignarCliente