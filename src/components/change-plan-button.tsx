'use client'
import React, {useState} from "react";
import LoadingSpinner from "@/components/loading-spinner";
import {changeSubscription} from "@/app/actions/subscriptions";
import {toast} from "react-toastify";

export const ChangePlanButton = ({subscriptionUuid, planUuid}: {subscriptionUuid: string; planUuid: string}) => {
  const [isChangingSubscription, setIsChangingSubscription] = useState(false);
  return (
    <button
      onClick={async () => {
        setIsChangingSubscription(true)
        const change = await changeSubscription(subscriptionUuid, planUuid)
        if (change?.error) toast.error(change?.error)
        setIsChangingSubscription(false)
      }}
      className='p-4 text-white rounded-md leading-none bg-blue-700 hover:bg-blue-900 transition flex items-center justify-center mr-2'
      disabled={isChangingSubscription}
    >
      Upgrade now
      {isChangingSubscription ? (
        <div className='w-[14px] ml-2'><LoadingSpinner fill="white"/></div>
      ) : ''}
    </button>
  )
}