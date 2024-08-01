"use client";
import { useCallback } from 'react';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LucideList, LucideGrid, LucideAlbum, LucideHouse } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"  
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios';
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from 'next/navigation';
import PokeModal from '@/modals/PokeModal';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [displayData, setDisplayData] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'owned'>('all'); 
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const isSearchEmpty = !search || search.length === 0;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
// Added to access modal through search params

  const { data: completeData } = useQuery({
  queryKey: ['pokemonList', search],
  queryFn: async () => {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
    return response.data;
  },
  });

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
    // initialPageParam value necessary to function at all
  });

  // useEffect for search because infinite load...
  useEffect(() => {
    isSearchEmpty ?
      setDisplayData(data?.pages.flatMap(page => page.results)) :
      setDisplayData(completeData?.results);
    return;
  }, [search, data, completeData, isSearchEmpty]);
// empty = incomplete data since incomplete = not fully loaded pokemon (the usual)
// not empty = search from all


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
//  Intersection Observer end (for infinite load to work)

  if (isLoading && !isFetching) {
  return <span><Skeleton className="w-[100px] h-[20px] rounded-full" /></span>;
  }

  if (isError) {
  console.error("Error! :( Please check:", isError);
  return <span>Error loading data!</span>;
  }

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
// Capitalization for  first letter move it to util folder later?

// Still not working. Ideally checks for datecaptured's presence to check if owned or not 
const isOwned = (pokemon: any) => {
  return !!pokemon.dateCaptured;
};

// supposed to filter based on displaydata on own status that probably wont work for now
const filteredData = displayData?.filter((pokemon: any) => {
  if (activeTab === 'owned') {
    return isOwned(pokemon); 
  }
  return true; 
});
// return true : show all 

return (
  <>
  <Tabs defaultValue="all" className="mx-auto flex flex-col flex-grow">
    <TabsList className='w-1/2 p-8 mx-auto'>
      <TabsTrigger value="all" className='flex flex-grow py-4 px-10' onClick={() => setActiveTab('all')}>
        <LucideAlbum className='mr-2' />All
      </TabsTrigger>
      <TabsTrigger value="owned" className='flex flex-grow py-4 px-10' onClick={() => setActiveTab('owned')}>
        <LucideHouse className='mr-2' />Owned
      </TabsTrigger>
      <div className='flex justify-center mb-5 mr-5'>
    <Button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} className="rounded ">
      {capitalizeFirstLetter(view)} {view === 'grid' ? <LucideGrid className='ml-2' /> : <LucideList className='ml-2' />}
    </Button>
      </div>
    </TabsList>
    <TabsContent value="all">
      <div className={`container mx-auto ${view === 'grid' ? 'grid grid-cols-4 gap-4 w-3/4' : 'flex flex-col w-1/2'}`}>
        {filteredData?.map((pokemon: any, index: number) => (
          (pokemon.name.includes(search.toLowerCase()) || isSearchEmpty) && (
            <Link key={pokemon.name} href={`?${createQueryString('pokemon', pokemon.name)}`}>
              <Card
                className={`border-2 border-red-400 bg-gray-100 ${view === 'list' ? 'flex items-center mb-2' : ''}`}
                ref={index === filteredData.length - 1 ? loadMoreRef : null}
              >
                {view === 'list' && (
                  <Image
                    className='m-4'
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                    width={100}
                    height={100}
                    alt={`${pokemon.name} sprite`}
                  />
                )}
                <div className={`${view === 'list' ? 'flex-2 pt-10' : ''}`}>
                  <CardHeader>
                    <CardTitle>
                      <h3><span className='text-gray-500 mr-2'>{index + 1}</span>{capitalizeFirstLetter(pokemon.name)}</h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={`align-middle p-3 m-3 border-2 border-black-200 rounded-xl ${view === 'list' ? 'bg-transparent border-none' : 'bg-white'}`}>
                    {view === 'grid' && (
                      <Image
                        className='mx-auto'
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                        width={150}
                        height={150}
                        alt={`${pokemon.name} sprite`}
                      />
                    )}
                  </CardContent>
                </div>
                <CardFooter>
                <span className={`mr-2 ${isOwned(pokemon) ? 'text-green-500' : 'text-gray-500'}`}>
  {isOwned(pokemon) ? 'Yes' : 'X'} 
</span>
                </CardFooter>
              </Card>
            </Link>
          )
        ))}
        {searchParams?.get('pokemon') && <PokeModal pokemon={searchParams.get('pokemon') || ''} />}
      </div>
    </TabsContent>
    <TabsContent value="owned">
      <div className={`container mx-auto ${view === 'grid' ? 'grid grid-cols-4 gap-4 w-3/4' : 'flex flex-col w-1/2'}`}>
        {filteredData?.map((pokemon: any, index: number) => (
          isOwned(pokemon) && (
            <Link key={pokemon.name} href={`?${createQueryString('pokemon', pokemon.name)}`}>
              <Card
                className={`border-2 border-red-400 bg-gray-100 ${view === 'list' ? 'flex items-center mb-2' : ''}`}
                ref={index === filteredData.length - 1 ? loadMoreRef : null}
              >
                {view === 'list' && (
                  <Image
                    className='m-4'
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                    width={100}
                    height={100}
                    alt={`${pokemon.name} sprite`}
                  />
                )}
                <div className={`${view === 'list' ? 'flex-2 pt-10' : ''}`}>
                  <CardHeader>
                    <CardTitle>
                      <h3><span className='text-gray-500 mr-2'>{index + 1}</span>{capitalizeFirstLetter(pokemon.name)}</h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={`align-middle p-3 m-3 border-2 border-black-200 rounded-xl ${view === 'list' ? 'bg-transparent border-none' : 'bg-white'}`}>
                    {view === 'grid' && (
                      <Image
                        className='mx-auto'
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                        width={150}
                        height={150}
                        alt={`${pokemon.name} sprite`}
                      />
                    )}
                  </CardContent>
                </div>
                
              </Card>
            </Link>
          )
        ))}
        {searchParams?.get('pokemon') && <PokeModal pokemon={searchParams.get('pokemon') || ''} />}
      </div>
    </TabsContent>
  </Tabs>

</>
);
        }

