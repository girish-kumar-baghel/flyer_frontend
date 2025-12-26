'use client'

import EventBookingForm from "@/components/orer-form/flyer-form"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { toJS } from "mobx"



const FlyerPage = ()=> {

  const { authStore, filterBarStore, flyerFormStore } = useStore()
  const {FlyerId} = useParams()

  // alert(FlyerId);
  useEffect(() => {
    flyerFormStore.fetchFlyer(FlyerId as string)
  }, [FlyerId])
  
// alert(JSON.stringify(flyerFormStore));
  

  return (
    <main className="min-h-screen bg-black">
      <EventBookingForm />
    </main>
  )
}


export default observer(FlyerPage);