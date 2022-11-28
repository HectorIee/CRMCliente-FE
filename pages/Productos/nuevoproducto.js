import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const NUEVO_PRODUCTO = gql`
mutation nuevoProducto($input: ProductoInput) {
  nuevoProducto(input: $input) {
    id
    nombre
    existencia
    precio
  }
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



const NuevoProducto = () => {
    // routeo
    const router = useRouter();

    // Mutation para agregar un producto
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        refetchQueries: [
            { query: OBTENER_PRODUCTOS },
            'obtenerProductos'
        ]
    });

    // Form para nuevos productos
    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required('El nombres es requerido'),
            existencia: Yup.number()
                .required('Introducir existencia')
                .positive('No se aceptan numeros negativos')
                .integer('Deben ser numeros enteros'),
            precio: Yup.number()
                .required('El precio es requerido')
                .positive('Deben ser numeros enteros')
        }),
        onSubmit: async valores => {

            const { nombre, existencia, precio } = valores;

            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio
                        }
                    }
                });
                // Show an alert
                Swal.fire(
                    'Creado',
                    'El producto ha sido creado',
                    'success'
                )
                // Redirigir
                router.push('/Productos/productos');
            } catch (error) {
                console.log(error);
            }

        }
    })

    const Regresar = () => {
        router.push('/Productos/productos')
    }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Crear un Producto Nuevo</h1>

            <div className='sm:flex mt-10 sm:w-1/6'>
                <button className='flex justify-center items-center bg-red-700 py-2 w-full text-white rounded text-base uppercase font-bold'
                    type='button' onClick={() => Regresar()}>
                    REGRESAR
                    <span className="material-symbols-outlined px-2"> reply </span>
                </button>
            </div>

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form className='bg-white shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit} >

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'> Nombre </label>
                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                id='nombre' type='text' placeholder='Nombre del producto'
                                onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.nombre} />
                        </div>

                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                <p className='font-bold'>Errors</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='existencia'> Existencia </label>
                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                id='existencia' type='number' placeholder='Cantidad'
                                onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.existencia} />
                        </div>

                        {formik.touched.existencia && formik.errors.existencia ? (
                            <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                <p className='font-bold'>Errors</p>
                                <p>{formik.errors.existencia}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'> Precio </label>
                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                id='precio' type='number' placeholder='Precio del Producto'
                                onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.precio} />
                        </div>

                        {formik.touched.precio && formik.errors.precio ? (
                            <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                <p className='font-bold'>Errors</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}

                        <input className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded-md'
                            type='submit' value='Añadir el Producto' />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NuevoProducto