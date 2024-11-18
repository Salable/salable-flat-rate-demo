'use client'
import React, {useState} from "react";
import LoadingSpinner from "@/components/loading-spinner";
import {getCheckoutLink} from "@/app/actions/checkout-link";
import {Session} from "@/app/actions/sign-in";
import {redirect} from "next/navigation";
import {toast} from "react-toastify";

export const PlanButton = ({session, planUuid}: {session: Session, planUuid: string, successUrl?: string}) => {
  const [isFetchingUrl, setIsFetchingUrl] = useState<boolean>(false)
  return (
    <button
      className={`p-4 text-white rounded-md leading-none bg-blue-700 w-full flex justify-center`}
      onClick={async () => {
        let url = null
        try {
          setIsFetchingUrl(true)
          const data = await getCheckoutLink(session, planUuid)
          if (data.error) toast.error(data.error)
          url = data.checkoutUrl
          setIsFetchingUrl(false)
        } catch (e) {
          setIsFetchingUrl(false)
          console.log(e)
        }
        if (url) (redirect(url))
      }}
    >
      {!isFetchingUrl ? "Purchase plan" : <div className='w-[15px]'><LoadingSpinner fill="white"/></div>}
    </button>
  )
}