"use client";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState, useEffect } from "react";
import { LucideX } from "lucide-react";
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
      console.error("localStorage error!", error);
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

  console.log(data)
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-[999999]">
      <div className="p-8 border border-gray-300 w-[40rem] shadow-lg rounded-lg bg-gray-800 relative">
        <div className="flex justify-end">
          <Link
            href={`/`}
            className="px-4 py-2 bg-rose-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <LucideX />
          </Link>
        </div>
        {/* Close button end */}
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-100">{capitalizeFirstLetter(pokemon)}</h4>
            <Image 
                    className='mx-auto'
                    src={data?.sprites.front_default}
                    width={150}
                    height={150}
                    alt={`${data?.name} sprite`}
            /> 
          <div className="mt-2 px-7 py-3 border border-gray-300 rounded-lg">
            {myPokemon.name && <p className="text-lg font-bold text-gray-100">{`Nickname: ${myPokemon.name}`}</p>}
            {myPokemon.dateCaptured && <p className="text-lg font-bold text-gray-100">{`Caught on: ${myPokemon.dateCaptured}`}</p>}
          </div>
          {/* Name + Date Captured */}
        <form onSubmit={saveToLocalStorage} className="mt-4">
          <div className="flex items-center ml-10 mb-4">
            <label htmlFor="pokemonName" className="text-sm font-medium text-gray-100 mr-2">Nickname</label>
            <input
              id="pokemonName"
              className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              value={myPokemon.name}
              onChange={e => setMyPokemon({ ...myPokemon, name: e.target.value })}
            />
          </div>
          <div className="flex items-center ml-6 mb-4">
            <label htmlFor="pokemonCaptureDate" className="text-sm font-medium text-gray-100 mr-2">Date Caught</label>
            <input
              id="pokemonCaptureDate"
              type="date"
              className='border border-gray-300 rounded-lg px-4 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-rose-500'
              value={myPokemon.dateCaptured || new Date().toISOString().split("T")[0]} 
              onChange={e => setMyPokemon({ ...myPokemon, dateCaptured: e.target.value })}
            />
            {/* Even without input: it defaults to current day, converted to ISO format then split from T onwards */}
          </div>
            <button type="submit" className="mt-2 mb-4 px-4 py-2 bg-rose-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">Update Capture Info</button>
          </form>
          {/* Form end */}
          <div>
            <p><span className="font-semibold">Height:</span> {(+data?.height / 10)} m</p> 
            <p><span className="font-semibold"></span>Weight: {(+data?.weight/ 10)} kg</p>
            {/* Height and weight are divided because the API data provided is in hectograms */}
            
          </div>
          {/* PokeAPI data above */}
        </div>
      </div>
    </div>
  );
}