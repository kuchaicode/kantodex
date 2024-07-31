import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LucideHouse, LucideAlbum } from 'lucide-react'


type Props = {}

const ContentTabs = (props: Props) => {
  return (
<Tabs defaultValue="all" className="mx-auto p-2 flex flex-col flex-grow items-center">
  <TabsList className='w-1/2 p-8 mx-auto'>
    <TabsTrigger value="all" className='flex flex-grow p-4'><LucideAlbum className='mr-2'/>All</TabsTrigger>
    <TabsTrigger value="owned" className='flex flex-grow p-4'><LucideHouse className='mr-2'/>Owned</TabsTrigger>
  </TabsList>
  <TabsContent value="all">Kanto Pokemon Content</TabsContent>
  <TabsContent value="owned">Owned Pokemon Content</TabsContent>
</Tabs>
  )
}

export default ContentTabs