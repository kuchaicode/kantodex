import React from 'react'
import { LucideSearch } from 'lucide-react'

type Props = {}

const Nav = (props: Props) => {
  return (
    <nav className='bg-red-400 shadow-xl'>
    <div className='max-w-6xl mx-auto px-3 py-4 flex items-center justify-between'>
      <div className='flex items-center'>
        <a href='#' className='text-xl font-bold text-gray-800'>Kantodex</a>
      </div>
      <div className='flex-grow flex justify-center relative'>
        <input
          type='text'
          placeholder='Search for Kanto Pokemon'
          className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-red-500'
        />
            <div className='absolute top-1/2 transform -translate-y-1/2 text-white-400'>
            <LucideSearch />
            {/* Yo why it there??? */}
            </div>
      </div>
      <div className='flex items-center'>
        <a href='#' className='text-gray-800 hover:text-red-500'>HMMM</a>
        
      </div>
    </div>
  </nav>
  )
}

export default Nav


