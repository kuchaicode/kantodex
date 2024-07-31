"use client"

import React, { useCallback } from 'react'
import { LucideSearch } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

type Props = {}

const Nav = (props: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const debounce = (func: any, delay: number) => {
        let timer: any
        return (...args: any) => {
          clearTimeout(timer)
          timer = setTimeout(() => {
            func(...args)
          }, delay)
        }
      }
// Debounce for search PLEASE WORK

const createQueryString = debounce(useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  ), 500)
// Searchy function. 500 milliseconds

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
            onChange={(e) => {createQueryString('search', e.target.value)}}
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


