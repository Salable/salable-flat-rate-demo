'use server'
import Link from "next/link";
import {SalableLogo} from "@/components/salable-logo";
import {getIronSession} from "iron-session";
import {cookies} from "next/headers";
import {prismaClient} from "../../prisma";
import {Dropdown} from "@/components/dropdown";
import { Session } from "@/app/actions/sign-in";

export const Header = async () => {
  const session = await getIronSession<Session>(await cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session-flat-rate" });
  const user = await prismaClient.users.findUnique({
    where: {uuid: session.uuid ?? ''}
  })

  return (
    <header className='bg-white px-6'>
      <div className='max-w-[1000px] m-auto py-4 flex justify-between items-center'>
        <Link className='flex items-center' href='/'>
          <div className='w-[30px] mr-2'><SalableLogo/></div>
          <span>Salable Flat Rate Demo</span>
        </Link>
        <div>
          <div className="flex justify-between items-center">
            {user ? (
              <Dropdown
                user={user}
                session={JSON.parse(JSON.stringify(session))}
              />
            ) : (
              <Link className='p-3 text-white rounded-md leading-none bg-blue-700 w-full text-center text-sm' href="/sign-in">Sign in</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}