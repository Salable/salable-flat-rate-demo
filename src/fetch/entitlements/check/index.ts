import {salableProductUuid} from "@/app/constants";
import {Result} from "@/app/actions/checkout-link";
import {EntitlementCheck} from "@salable/node-sdk/dist/src/types";
import {salable} from "@/app/salable";

export async function entitlementsCheck(granteeId: string): Promise<Result<EntitlementCheck>> {
  try {
    const check = await salable.entitlements.check({
      productUuid: salableProductUuid,
      granteeIds: [granteeId],
    })
    return {
      data: check,
      error: null
    }
  } catch (e) {
    console.log(e)
    return {
      data: null,
      error: 'Failed to check license'
    }
  }
}