import {getOneSubscription, SalableSubscription} from "@/fetch/subscriptions";
import {salableBasicPlanUuid, salableProPlanUuid} from "@/app/constants";
import React, {Suspense} from "react";
import {ChangePlanButton} from "@/components/change-plan-button";
import {getSubscriptionInvoices} from "@/app/actions/subscriptions";
import {format} from "date-fns";
import Link from "next/link";
import {CancelPlanButton} from "@/components/cancel-plan-button";
import {FetchError} from "@/components/fetch-error";
import {getSession} from "@/fetch/session";
import {redirect} from "next/navigation";

export const metadata = {
  title: 'Subscription',
}

export default async function SubscriptionPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = await params
  const session = await getSession()
  if (!session?.uuid) redirect('/')
  const subscription = await getOneSubscription(uuid)
  if (subscription.error) {
    return (
      <div className='max-w-[1000px] m-auto text-sm'>
        <FetchError error={subscription.error}/>
      </div>
    )
  }
  if (subscription.data?.email !== session.email) redirect('/')

  return (
    <div className='max-w-[1000px] m-auto text-sm'>
      <Subscription uuid={uuid} subscription={subscription.data} />
      <div className='mt-6'>
        <h2 className='text-2xl font-bold text-gray-900'>Invoices</h2>
        <div className='mt-3'>
          <Suspense fallback={<InvoicesLoading/>}>
            <Invoices uuid={uuid}/>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

const Subscription = async ({uuid, subscription}: { uuid: string, subscription: SalableSubscription }) => {
  return (
    <>
      <h1 className='text-3xl mb-6 flex items-center'>Subscription
        <span
          className={`px-2 ml-2 py-2 rounded-md leading-none ${subscription.status === 'CANCELED' ? 'bg-red-200 text-red-500' : 'bg-green-200 text-green-700'} uppercase text-lg font-bold`}
        >
          {subscription.status}
        </span>
      </h1>
      <div className='mb-3'>
        <div className='flex justify-between items-end mb-3'>
          <div>
            <div className='text-gray-500'>Plan</div>
            <div className='text-xl'>{subscription.plan.displayName}</div>
          </div>
        </div>
      </div>
      {subscription.status !== 'CANCELED' ? (
        <div>
          <div className='flex'>
            <ChangePlanButton
              subscriptionUuid={uuid}
              planUuid={subscription.planUuid === salableProPlanUuid ? salableBasicPlanUuid : salableProPlanUuid}
              planName={subscription.planUuid === salableProPlanUuid ? 'Basic plan' : 'Pro plan'}
            />
            <CancelPlanButton subscriptionUuid={uuid}/>
          </div>
        </div>
      ) : null}
    </>
  )
}

const Invoices = async ({uuid}: { uuid: string }) => {
  const invoices = await getSubscriptionInvoices(uuid);
  return (
    <div>
      {invoices.data ? (
        <div className='rounded-sm bg-white'>
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
                    <Link className='text-blue-700 hover:underline' href={invoice.hosted_invoice_url}>View</Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : invoices.error ? (
        <FetchError error={invoices.error}/>
      ) : null}
    </div>
  )
}

const InvoicesLoading = () => {
  return (
    <div>
      {[...new Array(2)].map((_, index) => (
        <div className="shadow rounded-sm p-4 w-full bg-white mx-auto border-b-2" key={`loading-${index}`}>
          <div className="animate-pulse flex justify-between w-full">
            <div className='flex'>
              <div className="mr-2 h-2 bg-slate-300 rounded w-[100px]"></div>
            </div>
            <div className='flex'>
              <div className="mr-2 h-2 bg-slate-300 rounded w-[20px]"></div>
              <div className="h-2 bg-slate-300 rounded w-[50px]"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}