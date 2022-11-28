import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
            nombre
            precio
            existencia
    }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
mutation actualizarProducto($id: ID!, $input: ProductoInput ) {
    actualizarProducto(id: $id, input: $input ) {
    id
    nombre
    existencia
    precio
  }
}
`;

const EditarProducto = () => {
    const router = useRouter();
    const { query: { pid:id } } = router;

    // consulta para producto
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id
        }
    });

    // mutation para modificar el producto
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO, {
        refetchQueries: [
            { query: OBTENER_PRODUCTO },
            'obtenerProducto'
        ]
    });

    // validation schema 
    const schemaValidation = Yup.object({
        nombre: Yup.string()
            .required('El nombre del producto es requerido'),
        existencia: Yup.number()
            .required('Añadir el stock disponible')
            .positive('No se acepta un stock negativo')
            .integer('Debe contener números enteros'),
        precio: Yup.number()
            .required('El precio es requerido')
            .positive('Debe contener números enteros')

    });

    if (loading) return 'Cargandoo...';

    if (!data) {
        return ('Accion Denegada');
    }

    const actualizarInfoProducto = async valores => {

        const { nombre, existencia, precio } = valores;
        try {
            const { data } = await actualizarProducto({
                variables: {
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            });
            // Redirigir
            router.push('/Productos/productos');
            // Muestra alerta
            Swal.fire(
                'Actualizado!',
                'Producto actualizado',
                'success'
            )

        } catch (error) {
            console.log(error);
        }
    }

    const Regresar = () => {
        router.push('/Productos/productos')
    }

    const { obtenerProducto } = data;

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

            <div className='sm:flex mt-10 sm:w-1/6'>
                <button className='flex justify-center items-center bg-red-700 py-2 w-full text-white rounded text-base uppercase font-bold'
                    type='button' onClick={() => Regresar()}>
                    REGRESAR
                    <span className="material-symbols-outlined px-2"> reply </span>
                </button>
            </div>

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>

                    <Formik enableReinitialize initialValues={obtenerProducto} validationSchema={schemaValidation}
                        onSubmit={valores => {
                            actualizarInfoProducto(valores)
                        }} >

                        {props => {
                            return (


                                <form className='bg-white shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={props.handleSubmit} >

                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'> Nombre </label>
                                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                                id='nombre'  type='text'  placeholder='Nombre Producto'
                                                onChange={props.handleChange}  onBlur={props.handleBlur}  value={props.values.nombre} />
                                    </div>

                                    {props.touched.nombre && props.errors.nombre ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                            <p className='font-bold'>Errors</p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                    ) : null}

                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='existencia'> Existencia </label>
                                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                                id='existencia'  type='number' placeholder='Stock'
                                                onChange={props.handleChange}  onBlur={props.handleBlur}  value={props.values.existencia}  />
                                    </div>

                                    {props.touched.existencia && props.errors.existencia ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                            <p className='font-bold'>Errors</p>
                                            <p>{props.errors.existencia}</p>
                                        </div>
                                    ) : null}

                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'> Precio </label>
                                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                                id='precio' type='number'  placeholder='Precio del producto'
                                                onChange={props.handleChange}  onBlur={props.handleBlur}   value={props.values.precio}  />
                                    </div>

                                    {props.touched.precio && props.errors.precio ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                            <p className='font-bold'>Errores</p>
                                            <p>{props.errors.precio}</p>
                                        </div>
                                    ) : null}

                                    <input className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded-md ' type='submit' value='Guardar Cambios' />
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    )
}

export default EditarProducto