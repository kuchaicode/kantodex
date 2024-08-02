"use client"

import React, { useCallback } from 'react'
import { LucideSearch } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

import ThemeToggle from '@/lib/ThemeToggle'


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
// Debounce (delay) for search 

const createQueryString = debounce(useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  ), 500)
// Searchy function. 500: milliseconds

  return (
<nav className='bg-rose-800 shadow-xl'>
    <div className='mx-auto px-3 py-4 flex justify-between'>
        <div className='flex-grow flex justify-center relative'>
            <input
                type='text'
                placeholder='Search for Kanto Pokemon'
                className='ml-28 max-w-md border border-red-600 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black placeholder-gray-400'
                onChange={(e) => { createQueryString('search', e.target.value) }}
            />
            <div className='relative right-10 top-7 transform -translate-y-1/2 text-black'>
                <LucideSearch />
            </div>
        </div>
        <div className="mr-28">
            <ThemeToggle />
        </div>
    </div>
</nav>
)
}

export default Nav


