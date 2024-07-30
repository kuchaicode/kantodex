"use client"

import React from 'react'
import CardData from '@/components/CardData'
import CardBody from './CardBody'


type Props = {}

const data = CardData();

const CardsGrid = (props: Props) => {


  return (
    <>
    {data.map((item, index) => (
        <CardBody key={index} data={item} />
      ))}
  </>
  )
}

export default CardsGrid