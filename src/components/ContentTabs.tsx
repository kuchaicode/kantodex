import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LucideHouse, LucideAlbum } from 'lucide-react'


type Props = {}

const ContentTabs = (props: Props) => {
  return (
<Tabs defaultValue="all" className="mx-auto p-2 flex flex-grow items-center">
  <TabsList className='w-1/2'>
    <TabsTrigger value="all"><LucideAlbum className='mr-2'/>All</TabsTrigger>
    <TabsTrigger value="owned"><LucideHouse className='mr-2'/>Owned</TabsTrigger>
  </TabsList>
  <TabsContent value="all">Make changes to your account here.</TabsContent>
  <TabsContent value="owned">Change your password here.</TabsContent>
</Tabs>
  )
}

export default ContentTabs