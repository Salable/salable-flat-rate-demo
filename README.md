![Salable Flat Rate Pricing Demo](https://raw.githubusercontent.com/Salable/flat-rate-demo/f6053bdc6bb4a4be12a1dc07e805cf7a9854a91b/public/flat-rate-banner.gif)

[//]: # ([![Deploy to vercel]&#40;https://camo.githubusercontent.com/20bea215d35a4e28f2c92ea5b657d006b087687486858a40de2922a4636301ab/68747470733a2f2f76657263656c2e636f6d2f627574746f6e&#41;]&#40;https://vercel.com/clone?repository-url=https://github.com/avst-perrygeorge/flat-rate-demo&env=TURSO_DATABASE_URL,TURSO_AUTH_TOKEN,SALABLE_API_KEY,SESSION_COOKIE_NAME,SESSION_COOKIE_PASSWORD,NEXT_PUBLIC_APP_BASE_URL,NEXT_PUBLIC_SALABLE_API_BASE_URL,NEXT_PUBLIC_PRODUCT_UUID,NEXT_PUBLIC_SALABLE_PLAN_UUID,NEXT_PUBLIC_SALABLE_PRO_PLAN_UUID&#41;)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/avst-perrygeorge/flat-rate-demo&env=TURSO_DATABASE_URL,TURSO_AUTH_TOKEN,SALABLE_API_KEY,SESSION_COOKIE_NAME,SESSION_COOKIE_PASSWORD,NEXT_PUBLIC_APP_BASE_URL,NEXT_PUBLIC_SALABLE_API_BASE_URL,NEXT_PUBLIC_PRODUCT_UUID,NEXT_PUBLIC_SALABLE_PLAN_UUID,NEXT_PUBLIC_SALABLE_PRO_PLAN_UUID&project-name=salable-flat-rate-demo&repository-name=salable-flat-rate-demo)

This app demonstrates using [flat rate](https://www.salable.app/features/flat-rate-pricing) billing with Salable.

## Tech stack
- [Next.js](http://Next.js)
- [Vercel](https://vercel.com/docs)
- [Iron sessions](https://github.com/vvo/iron-session)
- [Turso (DB)](https://turso.tech/)
- [Prisma (ORM)](https://www.prisma.io/)
- [Turso + Prisma](https://www.prisma.io/docs/orm/overview/databases/turso) ⚠️ Warning: using Turso with Prisma is currently experimental

## Demo

[View demo](https://flat-rate-demo.vercel.app/)

The product in the demo generates strings with random data which vary in size based on the number of bytes selected. To get access to the product a user must sign up and subscribe to a plan. The email of the sign up does not have to be real, this is just for demo purposes. The byte sizes for the strings are feature locked behind different plans. Once a user has subscribed they will be able access some or all of these features depending on what plan they are licensed on.

### Checkout
This instance of Salable is integrated with Stripe in test mode so no real money will ever be taken.
The customer email will be pre-populated with the email you have signed up with
In the Stripe checkout use the card number `4242 4242 4242 4242`, set a date in the future and the `CVC` can be any 3-digit number
Cardholder name can be any name.


## Auth
User details are stored in a Turso database, and passwords are securely hashed with unique salts. The ID of the logged-in user is used as the `granteeId` when creating a license on Salable and is also used for the Salable license checks. If you're developing an app within an existing ecosystem like Trello or Slack, you can swap out these authentication checks with their native authentication systems.

### User sessions
[Iron Session](https://github.com/vvo/iron-session) is used for storing user session data.

## Need some help?
Get answers and guidance from our own developers and commercial model consultants. If you have an implementation query, or you are not sure which pricing model to use for your app, our people are ready to help.

<a href="https://discord.com/channels/1064480618546737163/1219751191483781214">
<img alt="Join the salable discord" src="https://raw.githubusercontent.com/Salable/flat-rate-demo/refs/heads/main/public/discord-button.png" width="258" />
</a>
