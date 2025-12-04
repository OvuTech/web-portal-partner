# web-portal-partner

Partner/vendor portal for transport operators or businesses to manage listings, schedules, bookings, and payouts.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
API_URL=https://ovu-transport-staging.fly.dev
```

For production, set these in your Vercel project settings.

## Features

- Partner authentication (login, register, email verification)
- Dashboard with analytics and stats
- Bookings management
- Schedules & Inventory management
- Payouts & Reports
- Uploads / Manifest management
- Settings (Profile, Company, Security, Notifications)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Import your GitHub repository
2. Add environment variables:
   - `API_URL` = Your backend API URL
3. Add custom domain: `partners.ovu.ng`
4. Deploy!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
