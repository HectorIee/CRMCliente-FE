import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Sidebar = () => {
    //Routeo 
    const router = useRouter();

    return (
        <aside className='bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-2'>
            <div>
                <p className='text-white text-2xl font-black'>CRM Clientes</p>
            </div>
            <nav className='mt-5 list-none  '>
                <li className={router.pathname === "/" ? "bg-blue-900 p-2" : "p-2"}>
                    <Link href='/' className='text-white pt-6 block  text-lg'> Clientes </Link>
                </li>
                <li className={router.pathname === "/Productos/productos" ? "bg-blue-900 p-2" : "p-2"}>
                    <Link href='/Productos/productos' className='text-white pt-6 block  text-lg'> Productos </Link>
                </li>
                <li className={router.pathname === "/Pedidos/pedidos" ? "bg-blue-900 p-2" : "p-2"}>
                    <Link href='/Pedidos/pedidos' className='text-white pt-6 block text-lg '> Pedidos </Link>
                </li>
            </nav>

            <div className='sm:mt-10'>
                <p className='text-white text-2xl font-black'>Otras Opciones</p>
            </div>
            <nav className='mt-5 list-none  '>
                <li className={router.pathname === "/Mejores/mejoresClientes" ? "bg-blue-900 p-2" : "p-2"}>
                    <Link href='/Mejores/mejoresClientes' className='text-white pt-6 block  text-lg'> Mejores Clientes </Link>
                </li>
                <li className={router.pathname === "/Mejores/mejoresVendedores" ? "bg-blue-900 p-2" : "p-2"}>
                    <Link href='/Mejores/mejoresVendedores' className='text-white pt-6 block  text-lg'> Mejores Vendedores </Link>
                </li>
            </nav>
        </aside>
    )
}

export default Sidebar