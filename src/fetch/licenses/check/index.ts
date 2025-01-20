import {salableProductUuid} from "@/app/constants";
import {Result} from "@/app/actions/checkout-link";
import { CheckLicensesCapabilitiesResponse } from "@salable/node-sdk/dist/src/types";
import {salable} from "@/app/salable";

export async function licenseCheck(granteeId: string): Promise<Result<CheckLicensesCapabilitiesResponse>> {
  try {
    const check = await salable.licenses.check({
      productUuid: salableProductUuid,
      granteeIds: [granteeId],
    })
    console.log('check', check)
    return {
      data: check,
      error: null
    }
  } catch (e) {
    // implement salable error handling
    console.log(e)
    return {
      data: null,
      error: 'Failed to check license'
    }
  }
}