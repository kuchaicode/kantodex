"use client"
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState } from "react"

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function PokeModal({pokemon}: any, ) {

  const [value, setValue] = useLocalStorage(pokemon, "")
  const [myPokemon, setMyPokemon] = useState(value)

  const { isLoading, data }  = useQuery({
    queryKey: ['pokemon', pokemon],
    queryFn: async () => {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      return response.data;
    },
  });

  const saveToLocalStorage = (e: any) => {
    e.preventDefault()
    console.log(myPokemon)
    setValue(myPokemon)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[999999]">
      <div className="p-8 border w-[40rem] shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">{capitalizeFirstLetter(pokemon)}</h3>
          {value.name && <h3 className="text-2xl font-bold text-gray-900">{`Nickname:${myPokemon.name}`}</h3>}
          {value.dateCaptured && <h3 className="text-2xl font-bold text-gray-900">{`Caught on:${myPokemon.dateCaptured}`}</h3>}
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">Modal Body</p>
          </div>
          <form onSubmit={saveToLocalStorage}>
            <input
              id="pokemonName"
              className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-red-500'
              value={myPokemon.name}
              onChange={e => setMyPokemon({...myPokemon, name: e.target.value})}
            />
            <input
              id="pokemonCaptureDate"
              className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-red-500'
              value={myPokemon.dateCaptured}
              onChange={e => setMyPokemon({...myPokemon, dateCaptured: e.target.value})}
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">Save</button>
          </form>
          <div className="flex justify-center mt-4">
            <Link
              href={`/`}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}