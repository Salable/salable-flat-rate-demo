'use server'
import {randomBytes} from "crypto";
import {z} from "zod";
import {getIronSession} from "iron-session";
import {Session} from "@/app/actions/sign-in";
import {cookies} from "next/headers";
import {licenseCheck} from "@/fetch/licenses/check";

const ZodCreateStringRequestBody = z.object({
  bytes: z.union([z.literal('16'), z.literal('32'), z.literal('64'), z.literal('128')]),
});

type CreateStringRequestBody = z.infer<typeof ZodCreateStringRequestBody>

export const generateString = async (formData: CreateStringRequestBody) =>{
  try {
    const data = ZodCreateStringRequestBody.parse(formData)
    const session = await getIronSession<Session>(await cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session-flat-rate" });
    if (!session?.uuid) {
      return {
        data: null,
        error: 'Unauthorised'
      }
    }
    const bytes = Number(data.bytes)
    if (!bytes) return {data: null, error: 'Invalid bytes size'};

    const check = await licenseCheck(session.uuid)
    if (!check.data?.capabilitiesEndDates[formData.bytes]) {
      return {
        data: null,
        error: 'Unauthorised'
      }
    }
    return randomBytes(bytes).toString('hex');
  } catch (e) {
    console.error(e)
    return {error: 'Unknown error'}
  }
}