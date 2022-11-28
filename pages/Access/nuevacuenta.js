import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { useMutation, gql } from '@apollo/client'

const NUEVA_CUENTA = gql`
mutation nuevoUsuario($input: UsuarioInput) {
  nuevoUsuario(input: $input) {
    id
    nombre
    apellido
    email
  }
}
`;

const nuevacuenta = () => {
  // State for the messaje
  const [mensaje, guardarMensaje] = useState(null)

  // Mutation to create new users
  const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

  // Routing
  const router = useRouter()

  // Form validation
  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .required('El nombre es requerido'),
      apellido: Yup.string()
        .required('El apellido es requerido'),
      email: Yup.string()
        .email('El email es incorrecto')
        .required('El email es requerido'),
      password: Yup.string().required('La contraseña no puede quedar vacia')
        .min(6, 'La contraseña debe tener mas de 6 digitos')
    }),
    onSubmit: async valores => {
      const { nombre, apellido, email, password } = valores

      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password
            }
          }
        })
        console.log(data)

        // Si es creado correctamente
        guardarMensaje(`El usuario ha sido creado exitosamente: ${data.nuevoUsuario.nombre}`)
        setTimeout(() => {
          guardarMensaje(null)
          router.push('/Access/login')
        }, 3000)

        // Redirigir al login
      } catch (error) {
        guardarMensaje(error.message.replace('GraphQL error: ', ''))
        setTimeout(() => {
          guardarMensaje(null)
        }, 3000)
      }
    }
  })

  const mostrarMensaje = () => {
    return (
      <div className='bg-white text-black py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p>{mensaje}</p>
      </div>
    )
  }

  return (
    <div>
      <Layout>
        {mensaje && mostrarMensaje()}
        <h1 className='text-center text-2xl text-white font-light '>Crear Nueva Cuenta</h1>

        <div className='flex justify-center mt-5 '>
          <div className=' w-full max-w-sm '>
            <form className='bg-white rounded text-black shadow-md px-8 py-6 pb-8 mb-4' onSubmit={formik.handleSubmit} >

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'> Nombre </label>
                <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                  id='nombre' type='text' placeholder='Nombre'
                  value={formik.values.nombre} onChange={formik.handleChange} onBlur={formik.handleBlur} />
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
                  value={formik.values.apellido} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              </div>

              {formik.touched.apellido && formik.errors.apellido ? (
                <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                  <p className='font-bold'>Errors</p>
                  <p>{formik.errors.apellido}</p>
                </div>
              ) : null}


              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'> Email </label>
                <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                  id='email' type='email' placeholder='Email'
                  value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              </div>

              {formik.touched.email && formik.errors.email ? (
                <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                  <p className='font-bold'>Errors</p>
                  <p>{formik.errors.email}</p>
                </div>
              ) : null}


              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'> Contraseña </label>
                <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                  id='password' type='password' placeholder='Contraseña'
                  value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              </div>

              {formik.touched.password && formik.errors.password ? (
                <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                  <p className='font-bold'>Errors</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}

              <input type="submit" className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 rounded-md sm:text-base lg:text-md' value='Crear Cuenta' />
            </form>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default nuevacuenta