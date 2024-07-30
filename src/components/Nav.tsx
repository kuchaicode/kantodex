import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {}

const Nav = (props: Props) => {
  return (
<Tabs defaultValue="allpoke" className="w-[400px] place-self-center">
  <TabsList>
    <TabsTrigger value="allpoke">allpoke</TabsTrigger>
    <TabsTrigger value="mypoke">mypoke</TabsTrigger>
  </TabsList>
  <TabsContent value="allpoke">allpokeallpokeallpokeallpoke.</TabsContent>
  <TabsContent value="mypoke">mypokemypokemypokemypokemypoke.</TabsContent>
</Tabs>

  )
}

export default Nav


