import {TickIcon} from "@/components/icons/tick-icon";
import {CrossIcon} from "@/components/icons/cross-icon";
import Link from "next/link";
import {salableBasicPlanUuid, salableProPlanUuid} from "@/app/constants";
import {PlanButton} from "@/components/plan-button";
import React from "react";
import {getSession} from "@/fetch/session";
import {licenseCheck} from "@/fetch/licenses/check";

export const metadata = {
  title: 'Pricing',
  description: '.....',
}

export default async function Pricing() {
  let check = null
  const session = await getSession()
  if (session) check = await licenseCheck(session?.uuid)

  return (
    <div className='max-w-[1000px] mx-auto'>
      <div className='md:grid md:grid-cols-3 md:gap-6'>

        <div className='p-6 rounded-lg bg-white shadow flex-col mb-6 md:mb-0'>
          <h2 className='mb-2 font-bold text-2xl'>Basic</h2>
          <div className='mb-4'>
            <div className='flex items-end mb-1'>
              <div className='text-3xl mr-2'>
                <span className='font-bold'>£1</span>
                <span className='text-xl'> / per month</span>
              </div>
            </div>
          </div>
          <p className='text-gray-500 text-lg mb-4'>
            Everything you need to start building secure strings.
          </p>
          <div className='mb-6'>
            <div className='flex items-center'>
              <span className='mr-1'><TickIcon fill="#000" width={15} height={15}/></span>16 byte strings
            </div>
            <div className='flex items-center'>
              <span className='mr-1'><TickIcon fill="#000" width={15} height={15}/></span>32 byte strings
            </div>
            <div className='flex items-center'>
              <span className='mr-1'><TickIcon fill="#000" width={15} height={15}/></span>64 byte strings
            </div>
            <div className='flex items-center'>
              <span className='mr-1'><CrossIcon fill="#000" width={15} height={15}/></span>128 byte strings
            </div>
          </div>
          <div className='flex'>
            {session?.uuid ? (
              check?.capabilities?.find((a) => a === 'basic') ? (
                <div
                  className={`p-4 text-white rounded-md leading-none bg-green-700 inline-flex items-center w-full justify-center`}
                >
                  <div className='mr-1'><TickIcon fill='#FFF' height={18} width={18}/></div>
                  Already subscribed
                </div>
              ) : check?.capabilities?.find((a) => a === 'pro') && !check?.capabilities?.find((a) => a === 'basic') ? (
                <Link href='/settings/subscriptions'
                      className='block p-4 text-white rounded-md leading-none bg-blue-700 w-full text-center'>Downgrade
                  to Basic</Link>
              ) : (
                <PlanButton session={session} planUuid={salableBasicPlanUuid}/>
              )
            ) : (
              <Link
                href={`/sign-up?planUuid=${salableBasicPlanUuid}`}
                className='block p-4 text-white rounded-md leading-none bg-blue-700 w-full text-center'
              >
                Sign up
              </Link>
            )}
          </div>
        </div>

        <div className='p-6 rounded-lg bg-white shadow flex-col'>
          <h2 className='mb-2 font-bold text-2xl'>Pro</h2>
          <div className='mb-4'>
            <div className='flex items-end mb-1'>
              <div className='text-3xl mr-2'>
                <span className='font-bold'>£2</span>
                <span className='text-xl'> / per month</span>
              </div>
            </div>
          </div>
          <p className='text-gray-500 text-lg mb-4'>
            Everything you need to start building secure strings.
          </p>
          <div className='mb-6'>
            <div className='flex items-center'>
              <span className='mr-1'><TickIcon fill="#000" width={15} height={15}/></span>16 byte strings
            </div>
            <div className='flex items-center'>
              <span className='mr-1'><TickIcon fill="#000" width={15} height={15}/></span>32 byte strings
            </div>
            <div className='flex items-center'>
              <span className='mr-1'><TickIcon fill="#000" width={15} height={15}/></span>64 byte strings
            </div>
            <div className='flex items-center'>
              <span className='mr-1'><TickIcon fill="#000" width={15} height={15}/></span>128 byte strings
            </div>
          </div>
          <div>
            {session?.uuid ? (
              check?.capabilities?.find((a) => a === 'pro') ? (
                <div
                  className={`p-4 text-white rounded-md leading-none bg-green-700 inline-flex items-center w-full justify-center`}
                >
                  <div className='mr-1'><TickIcon fill='#FFF' height={18} width={18}/></div>
                  Already subscribed
                </div>
              ) : check?.capabilities?.find((a) => a === 'basic') && !check?.capabilities?.find((a) => a === 'pro') ? (
                <Link href='/settings/subscriptions'
                      className='block p-4 text-white rounded-md leading-none bg-blue-700 w-full text-center'>Upgrade to
                  Pro</Link>
              ) : (
                <PlanButton session={session} planUuid={salableProPlanUuid}/>
              )
            ) : (
              <Link
                href={`/sign-up?planUuid=${salableProPlanUuid}`}
                className='block p-4 text-white rounded-md leading-none bg-blue-700 w-full text-center'
              >
                Sign up
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}