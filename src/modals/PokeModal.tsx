"use client";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import Image from "next/image";

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default function PokeModal({ pokemon }: { pokemon: string }) {
  const [value, setValue] = useLocalStorage(pokemon, "");
  const [myPokemon, setMyPokemon] = useState({ name: "", dateCaptured: "" });
  const [isSaved, setIsSaved] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ['pokemon', pokemon],
    queryFn: async () => {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      return response.data;
    },
  });

  useEffect(() => {
    try {
      const parsedValue = JSON.parse(value);
      if (parsedValue.name && parsedValue.dateCaptured) {
        setMyPokemon(parsedValue);
        setIsSaved(true); 
      }
    } catch (error) {
      console.error('Error parsing localStorage:', error);
    }
  }, [value]);

  const saveToLocalStorage = (e: any) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0]; 
    const serializedData = JSON.stringify({
      name: myPokemon.name,
      dateCaptured: myPokemon.dateCaptured || currentDate, 
    });
    setValue(serializedData);
    setIsSaved(true);
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[999999]">
      <div className="p-8 border border-gray-300 w-[40rem] shadow-lg rounded-lg bg-gray-100 relative">
        <div className="flex justify-end">
          <Link
            href={`/`}
            className="px-4 py-2 bg-red-400 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            X
          </Link>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">{capitalizeFirstLetter(pokemon)}</h3>
          {myPokemon.name && <h3 className="text-2xl font-bold text-gray-900">{`Nickname: ${myPokemon.name}`}</h3>}
          {/* <Image 
                    className='mx-auto'
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                    width={150}
                    height={150}
                    alt={`${pokemon.name} sprite`}
                  /> */}
          {myPokemon.dateCaptured && <h3 className="text-2xl font-bold text-gray-900">{`Caught on: ${myPokemon.dateCaptured}`}</h3>}
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">Modal Body</p>
          </div>
          <form onSubmit={saveToLocalStorage}>
            <label htmlFor="pokemonName" className="block text-sm font-medium text-gray-700">Nickname:</label>
            <input
              id="pokemonName"
              className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-red-500'
              value={myPokemon.name}
              onChange={e => setMyPokemon({ ...myPokemon, name: e.target.value })}
            />
            <label htmlFor="pokemonCaptureDate" className="block text-sm font-medium text-gray-700 mt-4">Date Caught:</label>
            <input
              id="pokemonCaptureDate"
              type="date"
              className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-red-500'
              value={myPokemon.dateCaptured || new Date().toISOString().split("T")[0]} 
              onChange={e => setMyPokemon({ ...myPokemon, dateCaptured: e.target.value })}
            />
            <button type="submit" className="mt-4 px-4 py-2 bg-red-400 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">Mark as Captured</button>
          </form>
        </div>
      </div>
    </div>
  );
}