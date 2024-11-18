import {getIronSession} from "iron-session";
import {Session} from "@/app/actions/sign-in";
import {cookies} from "next/headers";

export const getSession = async () => {
  try {
    const session = await getIronSession<Session>(await cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session-flat-rate" })
    return JSON.parse(JSON.stringify(session)) as Session;
  } catch (e) {
    console.error(e);
  }
}