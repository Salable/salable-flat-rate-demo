import {getAllSubscriptions} from "@/fetch/subscriptions";
import Link from "next/link";
import React from "react";
import {FetchError} from "@/components/fetch-error";

export const metadata = {
  title: 'Subscriptions',
  description: '.....'
}

export default async function SubscriptionPage() {
  const subscriptions = await getAllSubscriptions()
  return (
    <main>
      <div className='max-w-[1000px] m-auto text-sm'>
        {subscriptions.data ? (
          <>
            <h1 className='text-3xl mb-4'>Subscriptions</h1>
            <div>
              {subscriptions.data.data.length ? (
                subscriptions.data.data.sort((a, b) => {
                  if (a.status === 'CANCELED') return 1
                  if (b.status === 'CANCELED') return -1
                  return 0
                }).map((subscription, index) => (
                  <div className='bg-white mb-3 flex justify-between items-center shadow rounded-sm p-3'
                       key={`subscription-${index}`}>
                    <div className='flex items-center'>
                      <div className='text-lg mr-2 leading-none'>{subscription.plan.displayName}</div>
                      {subscription.plan.licenseType === 'perSeat' ? <span
                        className='text-sm'>({subscription.quantity} seat{Number(subscription.quantity) > 1 ? "s" : ""})</span> : null}
                    </div>
                    <div>
                      {subscription.status === 'CANCELED' ? <span
                        className='bg-red-200 text-red-500 text-xs uppercase p-1 leading-none rounded-sm font-bold mr-2'>{subscription.status}</span> : null}
                      <Link className='text-blue-500' href={`/settings/subscriptions/${subscription.uuid}`}>View</Link>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <p className='mb-3'>No subscriptions found. Subscribe to one of our plans to <Link href='/pricing' className={'text-blue-500'}>get
                    started!</Link></p>
                </div>
              )}
            </div>
          </>
        ) : subscriptions.error ? (
          <FetchError error={subscriptions.error} />
        ) : null}
      </div>
    </main>
  );
}