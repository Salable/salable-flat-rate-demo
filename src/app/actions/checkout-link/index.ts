'use server'
import {Session} from "@/app/actions/sign-in";
import {appBaseUrl, salableApiBaseUrl, salableApiKeyPlansRead} from "@/app/constants";
import {handleError} from "@/app/actions/handle-error";

export async function getCheckoutLink(session: Session, planUuid: string) {
  try {
    const params = new URLSearchParams({
      customerEmail: session.email,
      granteeId: session.uuid,
      member: session.email,
      successUrl: `${appBaseUrl}?planUuid=${planUuid}`,
      cancelUrl: `${appBaseUrl}/pricing`,
    })
    const res = await fetch(`${salableApiBaseUrl}/plans/${planUuid}/checkoutlink?${params.toString()}`, {
      headers: {'x-api-key': salableApiKeyPlansRead}
    })
    if (res.ok) return await res.json()
    return await handleError(res, 'Plan')
  } catch (e) {
    console.error(e)
    return {error: 'Unknown error'}
  }
}