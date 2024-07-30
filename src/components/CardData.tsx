"use client";
import { useRef } from 'react';
import { useCallback } from 'react';
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
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {}

const fetchPokemon = async ({ pageParam = 0 }) => {
  const limit = pageParam >= 140 ? 11 : 20;
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=${limit}`);
  return response.data;
};
// pageParam = from Tanstack Query, needed for InfiniteQuery
// Uses offset and limit here
// Limit: on 140th load 11 to stop properly in Gen1


export default function CardData() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['pokemonList'],
    queryFn: fetchPokemon,
    getNextPageParam: (lastPage, allPages) => {
      const totalItemsFetched = allPages.reduce((acc, page) => acc + page.results.length, 0);
      if (totalItemsFetched >= 150) {
        return undefined;
      }
      const nextPageOffset = lastPage.next ? new URL(lastPage.next).searchParams.get('offset') : undefined;
      return nextPageOffset !== undefined ? parseInt(nextPageOffset || '', 10) : undefined;
      // using OR for fallback value when nextPageOffset is null. This ensures it is read as a string...
    },
    initialPageParam: 0, 
  });

  // Node: HTMLelement, else doesnt compile
  const loadMoreRef = useCallback((node: HTMLElement | null) => {
    if (!node || isLoading || !hasNextPage) return;
  
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
  
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [isLoading, hasNextPage, fetchNextPage]);

  if (isLoading && !isFetching) {
    return <span><Skeleton className="w-[100px] h-[20px] rounded-full" /></span>;
  }

  if (isError) {
    console.error("Error! :( Please check:", isError);
    return <span>Error loading data!</span>;
  }

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
// Capitalization for  first letter

  return (
    <>
    <div className="container mx-auto grid grid-cols-5 gap-3 ">
      {data?.pages.flatMap(page => page.results).map((pokemon, index) => (
        <Card 
          key={pokemon.name} 
          className="border-2 border-red-400 bg-gray-100"
          ref={index === data.pages.flatMap(page => page.results).length - 1 ? loadMoreRef : null}
        >
          <CardHeader>
            <CardTitle>
              <h3>{capitalizeFirstLetter(pokemon.name)}</h3>
            </CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent className="align-middle p-3 m-3 border-2 border-black-200 rounded-md bg-white">
            <Image 
              className='mx-auto'
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
              width={150}
              height={150}
              alt={`${pokemon.name} sprite`}
            />
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  </>
          );
        }