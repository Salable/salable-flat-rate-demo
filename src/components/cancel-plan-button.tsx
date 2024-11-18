'use client'
import React, {useState} from "react";
import LoadingSpinner from "@/components/loading-spinner";
import {cancelSubscription, changeSubscription} from "@/app/actions/subscriptions";
import {toast} from "react-toastify";

export const CancelPlanButton = ({subscriptionUuid}: {subscriptionUuid: string}) => {
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  return (
    <button
      className={`p-4 rounded-md leading-none text-white bg-red-600 flex items-center justify-center`}
      onClick={async () => {
        setIsCancellingSubscription(true)
        const cancel = await cancelSubscription(subscriptionUuid)
        if (cancel?.error) {
          console.error(cancel.error)
          toast.error(cancel.error)
        }
        setIsCancellingSubscription(false)
      }}
      disabled={disableButton}>
      {isCancellingSubscription ? (
        <div className='w-[14px] mr-2'><LoadingSpinner fill="white"/></div>) : ''}
      Cancel subscription
    </button>
  )
}