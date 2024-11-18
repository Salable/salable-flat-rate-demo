'use server'
import {salableApiBaseUrl} from "@/app/constants";
import {env} from "@/app/environment";
import {revalidatePath} from "next/cache";
import {SalableSubscription} from "@/fetch/subscriptions";
import {handleError} from "@/app/actions/handle-error";

export type GetAllInvoicesResponse = {
  first: string;
  last: string;
  hasMore: boolean;
  data: {
    created: number;
    effective_at: number;
    automatically_finalizes_at: number;
    hosted_invoice_url: string;
    invoice_pdf: string;
    lines: {
      data: {
        amount: number;
        price: { unit_amount: 1 }
        quantity: number;
      }[]
    }
  }[]
}

export const getSubscriptionInvoices = async (subscriptionUuid: string) => {
  try {
    const res = await fetch(`${salableApiBaseUrl}/subscriptions/${subscriptionUuid}/invoices`, {
      headers: {
        'x-api-key': env.SALABLE_API_KEY,
        version: 'v2'
      },
    })
    if (res.ok) return await res.json() as GetAllInvoicesResponse
    return await handleError(res, 'Subscription')
  } catch (e) {
    console.log(e)
    return {error: 'Unknown error'}
  }
}

export const changeSubscription = async (subscriptionUuid: string, planUuid: string) => {
  try {
    const changeSubscriptionRequest = await fetch(`${salableApiBaseUrl}/subscriptions/${subscriptionUuid}/change-plan`, {
      method: 'put',
      headers: {
        'x-api-key': env.SALABLE_API_KEY,
        version: 'v2'
      },
      body: JSON.stringify({planUuid})
    })
    if (!changeSubscriptionRequest.ok) return await handleError(changeSubscriptionRequest, 'Subscription')

    await new Promise<void>((resolve) => {
      const subscriptionPolling = setInterval(async () => {
        const res = await fetch(`${salableApiBaseUrl}/subscriptions/${subscriptionUuid}`, {
          headers: {
            'x-api-key': env.SALABLE_API_KEY,
            version: 'v2'
          },
        })
        if (res.ok) {
          const data = await res.json() as SalableSubscription
          if (data.planUuid === planUuid) {
            clearInterval(subscriptionPolling)
            resolve()
          }
        } else {
          clearInterval(subscriptionPolling)
        }
      }, 500)
    })

  } catch (e) {
    console.error(e)
    return {error: 'Unknown error'}
  }

  revalidatePath(`/settings/subscriptions/${subscriptionUuid}`)
}

export const cancelSubscription = async (subscriptionUuid: string) => {
  try {
    const res = await fetch(`${salableApiBaseUrl}/subscriptions/${subscriptionUuid}/cancel?when=now`, {
      method: 'PUT',
      headers: {
        'x-api-key': env.SALABLE_API_KEY,
        version: 'v2'
      },
    })
    if (!res.ok) return await handleError(res, 'Subscription')

    await new Promise<void>((resolve) => {
      const subscriptionPolling = setInterval(async () => {
        const res = await fetch(`${salableApiBaseUrl}/subscriptions/${subscriptionUuid}`, {
          headers: {
            'x-api-key': env.SALABLE_API_KEY,
            version: 'v2'
          },
        })
        if (res.ok) {
          const data = await res.json() as SalableSubscription
          if (data.status === 'CANCELED') {
            clearInterval(subscriptionPolling)
            resolve()
          }
        } else {
          clearInterval(subscriptionPolling)
        }
      }, 500)
    })
  } catch (e) {
    console.error(e)
    return {error: 'Unknown error'}
  }
  revalidatePath(`/settings/subscriptions/${subscriptionUuid}`)
}