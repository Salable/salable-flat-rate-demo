import {NextRequest, NextResponse} from "next/server";
import {env} from "@/app/environment";
import {randomBytes, randomUUID} from "crypto";
import {getIronSession} from "iron-session";
import {Session} from "@/app/settings/subscriptions/[uuid]/page";
import {cookies} from "next/headers";
import {z} from "zod";
import {
  appBaseUrl,
  salableApiBaseUrl,
  salableBasicPlanUuid,
  salableProPlanUuid,
  salableProductUuid
} from "@/app/constants";

const ZodCreateStringRequestBody = z.object({
  bytes: z.union([z.literal(16), z.literal(32), z.literal(64), z.literal(128)]),
});

type CreateStringRequestBody = z.infer<typeof ZodCreateStringRequestBody>

export async function POST(req: NextRequest) {
  try {
    const body: CreateStringRequestBody = await req.json()
    const randomString = randomBytes(body.bytes).toString('hex');

    return NextResponse.json(
      {randomString}, { status: 200 }
    );
  } catch (e) {
    const error = e as Error
    console.log(error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}