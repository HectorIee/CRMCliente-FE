import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

const NUEVO_CLIENTE = gql`
    mutation NuevoCliente($input: ClienteInput) {
        nuevoCliente(input: $input) {
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
    }
`;

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

const nuevoCliente = () => {

    const router = useRouter();

    // mostrar alerta
    const [mensaje, guardarMensaje] = useState(null);

    // Mutation para nuevos clientes
    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        refetchQueries: [
            { query: OBTENER_CLIENTES_USUARIO },
            'obtenerClientesVendedor'
        ]
    })
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required('El nombre es requerido'),
            apellido: Yup.string()
                .required('El apellido es requerido'),
            empresa: Yup.string()
                .required('La empresa es requerida'),
            email: Yup.string()
                .email('Email incorrecto')
                .required('El email es requerido'),
        }),
        onSubmit: async valores => {

            const { nombre, apellido, empresa, email, telefono } = valores

            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                });
                router.push('/') // redireccionar hacia
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error: ', ''));
                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
            }
        }
    })

    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }

    const Regresar = () => {
        router.push('/')
      }

    return (
        <Layout>
            <h1 className='text-2xl text-gray-800 font-light'>Nuevo Cliente</h1>

            <div className='sm:flex mt-10 sm:w-1/6'>
                <button className='flex justify-center items-center bg-red-700 py-2 w-full text-white rounded text-base uppercase font-bold'
                    type='button' onClick={() => Regresar()} >
                    REGRESAR
                    <span className="material-symbols-outlined px-2"> reply </span>
                </button>
            </div>

            {mensaje && mostrarMensaje()}

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form className='bg-white shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit} >

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'> Nombre </label>
                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                id='nombre' type='text' placeholder='Nombre'
                                onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.nombre} />
                        </div>

                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                <p className='font-bold'>Errors</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'> Apellido </label>
                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                id='apellido' type='text' placeholder='Apellido'
                                onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.email} />
                        </div>

                        {formik.touched.apellido && formik.errors.apellido ? (
                            <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                <p className='font-bold'>Errors</p>
                                <p>{formik.errors.apellido}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'> Empresa </label>
                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                id='empresa' type='text' placeholder='Empresa'
                                onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.empresa} />
                        </div>

                        {formik.touched.empresa && formik.errors.empresa ? (
                            <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                <p className='font-bold'>Errors</p>
                                <p>{formik.errors.empresa}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'> Email </label>
                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                id='email' type='email' placeholder='Email'
                                onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.email} />
                        </div>

                        {formik.touched.email && formik.errors.email ? (
                            <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                <p className='font-bold'>Errors</p>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'> Telefono </label>
                            <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                                id='telefono' type='tel' placeholder='Telefono'
                                onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.email} />
                        </div>

                        {formik.touched.telefono && formik.errors.telefono ? (
                            <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                                <p className='font-bold'>Errors</p>
                                <p>{formik.errors.telefono}</p>
                            </div>
                        ) : null}

                        <input className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded-md' type='submit' value='Crear Cliente' />
                    </form>
                </div>
            </div>
        </Layout>
    )
}
export default nuevoCliente