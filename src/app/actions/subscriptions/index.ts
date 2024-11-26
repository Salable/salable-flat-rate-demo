'use server'
import {salableApiBaseUrl} from "@/app/constants";
import {env} from "@/app/environment";
import {revalidatePath} from "next/cache";
import {getOneSubscription, SalableSubscription} from "@/fetch/subscriptions";
import {getErrorMessage} from "@/app/actions/get-error-message";
import { Result } from "../checkout-link";

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

export const getSubscriptionInvoices = async (subscriptionUuid: string): Promise<Result<GetAllInvoicesResponse>> => {
  try {
    const res = await fetch(`${salableApiBaseUrl}/subscriptions/${subscriptionUuid}/invoices`, {
      headers: {
        'x-api-key': env.SALABLE_API_KEY,
        version: 'v2'
      },
    })
    if (res.ok) {
      const data = await res.json() as GetAllInvoicesResponse
      return {
        data, error: null
      }
    }
    const error = await getErrorMessage(res, 'Subscription')
    console.log(error)
    return {
      data: null,
      error: 'Failed to fetch subscription invoices'
    }
  } catch (e) {
    console.log(e)
    return {
      data: null,
      error: 'Failed to fetch subscription invoices'
    }
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
    if (!changeSubscriptionRequest.ok) {
      const error = await getErrorMessage(changeSubscriptionRequest, 'Subscription')
      console.log(error)
      return {
        data: null,
        error: 'Failed to cancel subscription'
      }
    }

    await new Promise<void>((resolve) => {
      const subscriptionPolling = setInterval(async () => {
        const subscription = await getOneSubscription(subscriptionUuid)
        if (subscription.data?.planUuid === planUuid) {
          clearInterval(subscriptionPolling)
          resolve()
        }
      }, 500)
    })

  } catch (e) {
    console.error(e)
    return {data: null, error: 'Failed to cancel subscription'}
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
    if (!res.ok) {
      const error = getErrorMessage(res, 'Subscription')
      console.log(error)
      return {
        data: null,
        error: 'Failed to cancel subscription'
      }
    }

    await new Promise<void>((resolve) => {
      const subscriptionPolling = setInterval(async () => {
        const subscription = await getOneSubscription(subscriptionUuid)
        if (subscription.data?.status === 'CANCELED') {
          clearInterval(subscriptionPolling)
          resolve()
        }
      }, 500)
    })
  } catch (e) {
    console.log(e)
    return {
      data: null,
      error: 'Failed to cancel subscription'
    }
  }
  revalidatePath(`/settings/subscriptions/${subscriptionUuid}`)
}