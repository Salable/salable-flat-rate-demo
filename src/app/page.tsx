import {licenseCheck} from "@/fetch/licenses/check";
import React from "react";
import {StringGenerator} from "@/components/string-generator";
import {redirect} from "next/navigation";
import {getSession} from "@/fetch/session";
import {salableApiBaseUrl} from "@/app/constants";
import {env} from "@/app/environment";
import { Result } from "./actions/checkout-link";
import { Session } from "./actions/sign-in";
import {getErrorMessage} from "@/app/actions/get-error-message";

export const metadata = {
  title: 'Salable flat rate demo',
  description: '.........'
}

export type GetAllLicenses = {
  first: string;
  last: string;
  data: {
    uuid: string;
    granteeId: string;
    planUuid: string;
    subscriptionUuid: string;
  }[]
}

export default async function Home({searchParams}: {
  searchParams: Promise<Record<string, string>>
}) {
  const session = await getSession();

  const search = await searchParams
  if (search.planUuid && session?.uuid) {
    await new Promise<void>((resolve) => {
      const licensesPolling = setInterval(async () => {
        const data = await getLicenses(session, search.planUuid);
        if (data.error) clearInterval(licensesPolling)
        if (data.data?.data[0].planUuid === search.planUuid) {
          clearInterval(licensesPolling)
          resolve()
        }
      }, 500)
    })
  }
  const check = session?.uuid ? await licenseCheck(session.uuid) : {
    data: null, error: null
  }

  return (

    <main>
      <div className='max-w-[1000px] m-auto text-sm'>
        <div>
          <div className='mb-6'>
            <h1 className='text-4xl font-bold text-gray-900 mr-4 text-center'>
              Random String Generator
            </h1>
          </div>
        </div>

        {!check.error ? (
          <StringGenerator check={check.data} />
        ) : (
          <div>There has been an error</div>
        )}
      </div>
    </main>
  );
}

async function getLicenses(session: Session, planUuid: string): Promise<Result<GetAllLicenses>> {
  try {
    const res = await fetch(`${salableApiBaseUrl}/licenses?granteeId=${session.uuid}&planUuid=${planUuid}&status=active`, {
      headers: {
        'x-api-key': env.SALABLE_API_KEY,
        version: 'v2',
        cache: 'no-cache',
      },
    })
    if (res.ok) {
      const data = await res.json() as GetAllLicenses
      return {data, error: null}
    }
    const error = await getErrorMessage(res)
    return {data: null, error}
  } catch (e) {
    console.log(e)
    return {data: null, error: 'Unknown error'}
  }
}