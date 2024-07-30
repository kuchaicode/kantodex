import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"  
import CardData from '@/components/CardData'

type Props = {}

const data = CardData();

const CardBody = (data: any) => {
  return (
    <>
    <p></p>
    <Card>
        <CardHeader>
            <CardTitle>{data.name}</CardTitle>
            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
            <p> Test</p>
        </CardContent>
        <CardFooter>
            <p>Card Footer</p>
        </CardFooter>
    </Card>

    </>
    
  )
}

export default CardBody

