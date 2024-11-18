import {getOneSubscription} from "@/fetch/subscriptions";
import {salableBasicPlanUuid, salableProPlanUuid} from "@/app/constants";
import React from "react";
import {ChangePlanButton} from "@/components/change-plan-button";
import {getSubscriptionInvoices} from "@/app/actions/subscriptions";
import {format} from "date-fns";
import Link from "next/link";
import {CancelPlanButton} from "@/components/cancel-plan-button";

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
      {"uuid" in subscription ? (
        <div>
          <h1 className='text-3xl mb-6 flex items-center'>Subscription
              <>
                {subscription.status === 'ACTIVE' ? <span
                  className='px-2 ml-2 py-2 rounded-md leading-none bg-sky-200 text-sky-500 uppercase text-lg font-bold'>{subscription.plan.displayName}</span> : null}
                {subscription.status === 'CANCELED' ? <span
                  className='px-2 ml-2 py-2 rounded-md leading-none bg-red-200 text-red-500 uppercase text-lg font-bold'>{subscription.status}</span> : null}
              </>
          </h1>

          {subscription.status === 'CANCELED' ? (
            <div>
              <div className='flex justify-between items-end py-4 mb-3'>
                <div>
                  <div className='text-gray-500'>Plan</div>
                  <div className='text-xl'>{subscription?.plan?.displayName}</div>
                </div>
              </div>
            </div>
          ) : null}

          {subscription.status !== 'CANCELED' ? (
            <>
              <div>
                <div className='flex'>
                  {!subscription?.cancelAtPeriodEnd ? (
                    <>
                      <ChangePlanButton subscriptionUuid={uuid} planUuid={subscription.planUuid === salableProPlanUuid ? salableBasicPlanUuid : salableProPlanUuid} />
                      <CancelPlanButton subscriptionUuid={uuid} />
                    </>
                  ) : (
                    <div className='p-3 bg-gray-200 rounded-md max-w-[400px]'>
                      {/*<p className='mb-2'>Your subscription is set to cancel at the end of the month. If you'd like*/}
                      {/*  revert this change you can reactivate your subscription below.</p>*/}
                      {/*<button*/}
                      {/*  className={`p-4 text-white rounded-md leading-none bg-blue-700 flex items-center justify-center mr-2`}*/}
                      {/*  onClick={async () => {*/}
                      {/*    await reactivateSubscription()*/}
                      {/*  }}*/}
                      {/*>*/}
                      {/*  {isReactivatingSubscription ? (*/}
                      {/*    <div className='w-[14px] mr-2'><LoadingSpinner fill="white"/></div>) : ''}*/}
                      {/*  Reactivate*/}
                      {/*</button>*/}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {"data" in invoices && invoices.data?.length > 0 ? (
            <div className='mt-6'>
              <h2 className='text-2xl font-bold text-gray-900'>Invoices</h2>
              <div className='mt-3 rounded-sm bg-white'>
                {invoices?.data.sort((a, b) => a.created + b.created).map((invoice, index) => {
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
            </div>
          ) : null}

        </div>
        ) : (<></>)}
    </div>
  )
}