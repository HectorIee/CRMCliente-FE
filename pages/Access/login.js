import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'

const AUTENTICAR_USUARIO = gql`
    mutation authUsuario($input: AuthInput) {
        authUsuario(input: $input) {
            token
        }
    }   
`;

const login = () => {
  // routing 
  const router = useRouter()

  const [mensaje, guardarMensaje] = useState(null)

  // Mutation to create new users in apollo
  const [authUsuario] = useMutation(AUTENTICAR_USUARIO)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('El email no es valido')
        .required('El email es requerido'),
      password: Yup.string()
        .required('La contraseña es requerida')
    }),
    onSubmit: async valores => {
      // console.log(valores)
      const { email, password } = valores

      try {
        const { data } = await authUsuario({
          variables: {
            input: {
              email,
              password
            }
          }
        })
        console.log(data)
        guardarMensaje('Authenticando...')

        // Save the token in localstorage
        setTimeout(() => {
          const { token } = data.authUsuario
          localStorage.setItem('token', token)
        }, 1000);

        // Redirect to clients
        setTimeout(() => {
          guardarMensaje(null)
          router.push('/')
        }, 2000)

      } catch (error) {
        guardarMensaje(error.message.replace('GraphQL error: ', ''))
        // console.log(error)

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
        <h1 className='text-center text-2xl text-white font-light '>Iniciar Sesion</h1>

        <div className='flex justify-center mt-5 '>
          <div className=' w-full max-w-sm '>
            <form className='bg-white rounded text-black shadow-md px-8 py-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-3' htmlFor='email'> Email </label>
                <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                  id='email' type='email' placeholder='Email de Usuario'
                  onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.email} />
              </div>

              {formik.touched.email && formik.errors.email ? (
                <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                  <p className='font-bold'>Errors</p>
                  <p>{formik.errors.email}</p>
                </div>
              ) : null}

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-3' htmlFor='password'> Contraseña </label>
                <input className=' shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white'
                  id='password' type='password' placeholder='Contraseña de Usuario'
                  onChange={formik.handleChange} onBlur={formik.handleBlur} formik={formik.values.password} />
              </div>

              {formik.touched.password && formik.errors.password ? (
                <div className='my-2 bg-red-100 border-l-4 border-1-4 border-red-500 text-red-700 py-4 px-2'>
                  <p className='font-bold'>Errors</p>
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}

              <input type="submit" className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 rounded-md sm:text-base lg:text-md' value='Iniciar sesion' />
            </form>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default login