import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup'
import Swal from 'sweetalert2'


const OBTENER_CLIENTE = gql`
    query obtenerCliente($id:ID!) {
        obtenerCliente(id:$id) {
            id
            nombre
            apellido
            email
            telefono
            empresa
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
mutation ActualizarCliente($id: ID!, $input: ClienteInput) {
  actualizarCliente(id: $id, input: $input) {
    id
    nombre
    apellido
    email
    telefono
    empresa
  }
}
`

const EditarCliente = () => {
    // Get actual ID
    const router = useRouter();
    const { query: { pid: id } } = router;
    // console.log(id)

    // Consult to get the client
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    // Upload Client
    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
        refetchQueries: [
            { query: OBTENER_CLIENTE },
            'obtenerCliente'
        ]
    });

    // Validation Schema
    const schemaValidation = Yup.object({
        nombre: Yup.string()
            .required('El nombre es requerido'),
        apellido: Yup.string()
            .required('El apellido es requerido'),
        empresa: Yup.string()
            .required('La empresa es requerida'),
        email: Yup.string()
            .email('Email es invalido')
            .required('El email es requerido'),
    });

    if (loading) return 'Cargandoo...';

    // console.log(data.obtenerCliente)

    const { obtenerCliente } = data;

    // Modifica el cliente en la BD
    const actualizarInfoCLiente = async valores => {
        const { nombre, apellido, empresa, email, telefono } = valores;

        try {
            const { data } = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        empresa,
                        email,
                        telefono
                    }
                }
            });
            // Swal alerta
            Swal.fire(
                'Actualizado!',
                'Cliente Actualizado',
                'success'
            )

            // Redirect
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    const Regresar = () => {
        router.push('/')
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Cliente </h1>

            <div className='sm:flex mt-10 sm:w-1/6'>
                <button className='flex justify-center items-center bg-red-700 py-2 w-full text-white rounded text-base uppercase font-bold'
                    type='button'  onClick={() => Regresar()}>
                    REGRESAR
                    <span className="material-symbols-outlined px-2"> reply </span>
                </button>
            </div>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik validationSchema={schemaValidation} enableReinitialize initialValues={obtenerCliente}
                        onSubmit={valores => {
                            actualizarInfoCLiente(valores)
                        }} >

                        {props => {

                            return (
                                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={props.handleSubmit} >

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre"> Nombre </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 mt-1 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="nombre" type="text" placeholder="Nombre"
                                            onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.nombre} />
                                    </div>

                                    {props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                    ) : null}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido"> Apellido </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                                            id="apellido" type="text" placeholder="Apellido"
                                            onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.apellido} />
                                    </div>

                                    {props.touched.apellido && props.errors.apellido ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.apellido}</p>
                                        </div>
                                    ) : null}


                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa"> Empresa </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                                            id="empresa" type="text" placeholder="Empresa"
                                            onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.empresa} />
                                    </div>

                                    {props.touched.empresa && props.errors.empresa ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                    ) : null}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email"> Email </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                                            id="email" type="email" placeholder="Email"
                                            onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.email} />
                                    </div>

                                    {props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
                                        </div>
                                    ) : null}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono"> Telefono </label>
                                        <input className="shadow appearance-none border rounded w-full py-2 px-3 mt-1 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                                            id="telefono" type="tel" placeholder="Telefono"
                                            onChange={props.handleChange} onBlur={props.handleBlur} value={props.values.telefono} />
                                    </div>

                                    <input className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded-md"
                                        type="submit" value="Editar Cliente" />
                                </form>
                            )
                        }}
                    </Formik>


                </div>
            </div>

        </Layout>
    );
}

export default EditarCliente;