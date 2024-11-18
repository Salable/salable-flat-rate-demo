import {licenseCheck} from "@/fetch/licenses/check";
import React from "react";
import {StringGenerator} from "@/components/string-generator";
import {redirect} from "next/navigation";
import {getSession} from "@/fetch/session";
import {salableApiBaseUrl} from "@/app/constants";
import {env} from "@/app/environment";

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
  if (!session?.uuid) redirect('/sign-in')

  const search = await searchParams
  if (search.planUuid) {
    await new Promise<void>((resolve) => {
      const licensesPolling = setInterval(async () => {
        const res = await fetch(`${salableApiBaseUrl}/licenses?granteeId=${session.uuid}&planUuid=${search.planUuid}&status=active`, {
          headers: {
            'x-api-key': env.SALABLE_API_KEY,
            version: 'v2',
            cache: 'no-cache',
          },
        })
        if (res.ok) {
          const data = await res.json() as GetAllLicenses

          if (data.data[0].planUuid === search.planUuid) {
            clearInterval(licensesPolling)
            resolve()
          }
        } else {
          clearInterval(licensesPolling)
        }
      }, 500)
    })
  }
  const check = await licenseCheck(session.uuid)

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


        <StringGenerator check={check ?? null} />
      </div>
    </main>
  );
}