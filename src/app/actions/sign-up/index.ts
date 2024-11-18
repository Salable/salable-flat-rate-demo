'use server'
import {randomBytes, randomUUID} from "crypto";
import {hashString} from "@/utils/hash-string";
import {getIronSession} from "iron-session";
import {cookies} from "next/headers";
import {Session} from "@/app/actions/sign-in";
import {z} from "zod";
import {prismaClient} from "../../../../prisma";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {getCheckoutLink} from "@/app/actions/checkout-link";

const ZodSignUpRequestBody = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type SignUpRequestBody = z.infer<typeof ZodSignUpRequestBody>

export async function signUp(formData: SignUpRequestBody, planUuid: string | null) {
  let checkoutUrl: string | null = null
  try {
    const data = ZodSignUpRequestBody.parse(formData);

    const existingUser = await prismaClient.users.findFirst({
      where: {
        OR: [
          {email: data.email},
          {username: data.username},
        ],
      },
    })

    if (existingUser && existingUser.email === data.email) throw new Error("Email already exists")
    if (existingUser && existingUser.username === data.username) throw new Error("Username already exists")

    const salt = randomBytes(16).toString('hex');
    const hash = hashString(data.password, salt)

    const user = await prismaClient.users.create({
      data: {
        uuid: randomUUID(),
        username: data.username,
        email: data.email,
        salt,
        hash
      }
    })

    const session = await getIronSession<Session>(await cookies(), { password: 'Q2cHasU797hca8iQ908vsLTdeXwK3BdY', cookieName: "salable-session-flat-rate" });
    session.uuid = user.uuid;
    session.email = user.email
    await session.save();

    if (planUuid) {
      checkoutUrl = await getCheckoutLink(session, planUuid)
    }

  } catch (e) {
    const error = e as Error
    console.log(error)
    return {error}
  }

  revalidatePath('/')
  redirect(checkoutUrl ?? '/')
}