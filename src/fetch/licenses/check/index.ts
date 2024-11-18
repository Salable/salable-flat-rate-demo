import {env} from "@/app/environment";
import {salableApiBaseUrl, salableProductUuid} from "@/app/constants";
import {LicenseCheckResponse} from "@/components/string-generator";

export async function licenseCheck(granteeId: string) {
  try {
    const res = await fetch(`${salableApiBaseUrl}/licenses/check?granteeIds=${granteeId}&productUuid=${salableProductUuid}`, {
      headers: { 'x-api-key': env.SALABLE_API_KEY },
      cache: "no-store"
    })
    const headers = new Headers(res.headers)
    const headersMap = new Map(headers)
    if (headersMap.get('content-type') === 'text/plain') {
      return null
    }
    return await res.json() as LicenseCheckResponse
  } catch (e) {
    console.error(e)
  }
}