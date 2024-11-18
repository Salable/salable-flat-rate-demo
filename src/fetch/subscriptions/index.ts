import {env} from "@/app/environment";
import {getIronSession} from "iron-session";
import {cookies} from "next/headers";
import {salableApiBaseUrl} from "@/app/constants";
import {Session} from "@/app/actions/sign-in";

export type SalableSubscription = {
  uuid: string,
  paymentIntegrationSubscriptionId: string,
  productUuid: string,
  type: string,
  email: string,
  organisation: string,
  status: string,
  cancelAtPeriodEnd: boolean,
  quantity: string,
  createdAt: string,
  updatedAt: string,
  expiryDate: string,
  lineItemIds : string[],
  planUuid: string,
  isTest: boolean,
  plan: {
    uuid: string,
    name: string,
    description: string | null,
    displayName: string,
    slug: string,
    status: string,
    isTest: boolean,
    trialDays: number | null,
    evaluation: boolean,
    evalDays: number,
    organisation: string,
    visibility: string,
    licenseType: string,
    perSeatAmount: number,
    maxSeatAmount: number,
    interval: string,
    length: number,
    active: boolean,
    planType: string,
    pricingType: string,
    environment: string,
    paddlePlanId: string | null,
    productUuid: string,
    salablePlan: boolean,
    updatedAt: string,
    hasAcceptedTransaction: boolean,
    currencies: {
      price: number
    }[]
  }
}

export type GetAllSubscriptionsResponse = {
  first: string;
  last: string;
  data: SalableSubscription[],
}

export async function getAllSubscriptions(params?: {
  status?: string
}) {
  const session = await getIronSession<Session>(await cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session-flat-rate" });
  if (!session) throw new Error("No session found");
  const fetchParams = new URLSearchParams({
    ...params,
    email: session.email,
    expand: 'plan'
  });
  const res = await fetch(`${salableApiBaseUrl}/subscriptions?${fetchParams.toString()}`, {
    headers: { 'x-api-key': env.SALABLE_API_KEY, version: 'v2', cache: 'no-cache' },
  })
  const data = await res.json()
  if (res.ok) return data as GetAllSubscriptionsResponse

  throw new Error(data.error ?? 'Bad request')
}

export async function getOneSubscription(uuid: string) {
  try {
    const res = await fetch(`${salableApiBaseUrl}/subscriptions/${uuid}?expand=[plan.currencies]`, {
      headers: { 'x-api-key': env.SALABLE_API_KEY, version: 'v2' },
    })
    const data = await res.json()
    if (res.ok) {
      return data as SalableSubscription
    }
    throw new Error(data)
  } catch (e) {
    console.log(e)
  }
}