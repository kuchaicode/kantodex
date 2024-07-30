"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"  
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios';
import { useQuery } from "@tanstack/react-query";

type Props = {}

export default function CardData() {

  const { status, data, error } = useQuery({
    queryKey: ['pokemonList'],
    queryFn: async () => {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
      return response.data.results;
    },
  });

  if (status === 'pending') {
    return <span><Skeleton className="w-[100px] h-[20px] rounded-full" /></span>;
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>;
  }

  const capitalizeFirstLetter = (str:string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  return (

    <div className="container mx-auto grid grid-cols-4 gap-3 ">
      {data.map((pokemon:any, index:number) => (
          <Card key={pokemon.name} className="border-2 border-red-400 bg-gray-100">
            <CardHeader>
              <CardTitle >
                <h3>{capitalizeFirstLetter(pokemon.name)}</h3>
              </CardTitle>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent className="align-middle p-3 m-3 border-2 border-black rounded-md bg-white">
              <Image 
              className=''
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                width={200}
                height={200}
                alt={`{pokemon.name} sprite`}
              />
            </CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
      ))}
    </div>

  );

}

