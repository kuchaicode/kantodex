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
      if (value.name && value.dateCaptured) {
        setMyPokemon(value);
        setIsSaved(true); 
      }
    } catch (error) {
      console.error('localStorage error!', error);
    }
  }, [value]);

  const saveToLocalStorage = (e: any) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0]; 
    const serializedData = {
      name: myPokemon.name,
      dateCaptured: myPokemon.dateCaptured || currentDate, 
    };
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
        {/* Close button end */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">{capitalizeFirstLetter(pokemon)}</h3>
          {/* <Image 
                    className='mx-auto'
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                    width={150}
                    height={150}
                    alt={`${pokemon.name} sprite`}
                  /> */}
          <div className="mt-2 px-7 py-3 border border-gray-300 rounded-lg">
            {myPokemon.name && <p className="text-lg font-bold text-gray-700">{`Nickname: ${myPokemon.name}`}</p>}
            {myPokemon.dateCaptured && <p className="text-lg font-bold text-gray-700">{`Caught on: ${myPokemon.dateCaptured}`}</p>}
          </div>

          <form onSubmit={saveToLocalStorage} className="mt-4">
  <div className="flex items-center ml-10 mb-4">
    <label htmlFor="pokemonName" className="text-sm font-medium text-gray-700 mr-2">Nickname</label>
    <input
      id="pokemonName"
      className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-red-500'
      value={myPokemon.name}
      onChange={e => setMyPokemon({ ...myPokemon, name: e.target.value })}
    />
  </div>
  <div className="flex items-center ml-6 mb-4">
    <label htmlFor="pokemonCaptureDate" className="text-sm font-medium text-gray-700 mr-2">Date Caught</label>
    <input
      id="pokemonCaptureDate"
      type="date"
      className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-red-500'
      value={myPokemon.dateCaptured || new Date().toISOString().split("T")[0]} 
      onChange={e => setMyPokemon({ ...myPokemon, dateCaptured: e.target.value })}
    />
  </div>
    <button type="submit" className="mt-4 px-4 py-2 bg-red-400 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">Mark as Captured</button>
</form>

        </div>
      </div>
    </div>
  );
}