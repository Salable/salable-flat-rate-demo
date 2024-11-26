import {getOneSubscription} from "@/fetch/subscriptions";
import {salableBasicPlanUuid, salableProPlanUuid} from "@/app/constants";
import React from "react";
import {ChangePlanButton} from "@/components/change-plan-button";
import {getSubscriptionInvoices} from "@/app/actions/subscriptions";
import {format} from "date-fns";
import Link from "next/link";
import {CancelPlanButton} from "@/components/cancel-plan-button";
import {FetchError} from "@/components/fetch-error";

export const metadata = {
  title: 'Subscription',
  description: '.....'
}

export default async function SubscriptionPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  const subscription = await getOneSubscription(uuid)
  const invoices = await getSubscriptionInvoices(uuid);

  return (
    <div className='max-w-[1000px] m-auto text-sm'>
      {subscription.data ? (
        <>
          <h1 className='text-3xl mb-6 flex items-center'>Subscription
            <>
              {subscription.data.status === 'ACTIVE' ? <span
                className='px-2 ml-2 py-2 rounded-md leading-none bg-sky-200 text-sky-500 uppercase text-lg font-bold'>{subscription.data.plan.displayName}</span> : null}
              {subscription.data.status === 'CANCELED' ? <span
                className='px-2 ml-2 py-2 rounded-md leading-none bg-red-200 text-red-500 uppercase text-lg font-bold'>{subscription.data.status}</span> : null}
            </>
          </h1>

          {subscription.data.status === 'CANCELED' ? (
            <div>
              <div className='flex justify-between items-end py-4 mb-3'>
                <div>
                  <div className='text-gray-500'>Plan</div>
                  <div className='text-xl'>{subscription.data.plan.displayName}</div>
                </div>
              </div>
            </div>
          ) : null}

          {subscription.data.status !== 'CANCELED' ? (
            <>
              <div>
                <div className='flex'>
                  <ChangePlanButton subscriptionUuid={uuid} planUuid={subscription.data.planUuid === salableProPlanUuid ? salableBasicPlanUuid : salableProPlanUuid} />
                  <CancelPlanButton subscriptionUuid={uuid} />
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : subscription.error ? (
        <FetchError error={subscription.error} />
      ) : null}

      <div className='mt-6'>
        {invoices.data ? (
          <>
            <h2 className='text-2xl font-bold text-gray-900'>Invoices</h2>
            <div className='mt-3 rounded-sm bg-white'>
              {invoices?.data.data.sort((a, b) => a.created + b.created).map((invoice, index) => {
                return (
                  <div className='border-b-2 p-3 flex justify-between items-center' key={`invoice-${index}`}>
                    <div>
                      {invoice.effective_at ? (
                        <span>{format(new Date(invoice.effective_at * 1000), "d LLL yyy")}</span>
                      ) : null}
                      {invoice.automatically_finalizes_at ? (
                        <span>Finalises at {format(new Date(invoice.automatically_finalizes_at * 1000), 'd LLL yyy H:mm')}</span>
                      ) : null}
                    </div>
                    <div className='flex items-center'>
                          <span
                            className='mr-2'>£{(invoice.lines.data[0].quantity * invoice.lines.data[0].price.unit_amount) / 100}</span>
                      {invoice.automatically_finalizes_at && invoice.lines.data[0].price.unit_amount ? (
                        <>
                              <span
                                className='p-1 leading-none uppercase rounded-sm bg-gray-200 text-gray-500 text-xs font-bold'>DRAFT</span>
                        </>
                      ) : null}
                      {invoice.hosted_invoice_url ? (
                        <Link className='text-blue-700' href={invoice.hosted_invoice_url}>View</Link>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : invoices.error ? (
          <FetchError error={invoices.error} />
        ) : null}
      </div>
    </div>
  )
}