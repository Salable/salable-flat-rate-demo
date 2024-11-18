'use server'
import {getIronSession} from "iron-session";
import {cookies} from "next/headers";
import {Session} from "@/app/actions/sign-in";

export async function destroySession() {
  try {
    const session = await getIronSession<Session>(await cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session-flat-rate" });
    session.destroy()
  } catch (e) {
    console.log(e)
  }
}