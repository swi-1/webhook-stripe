import Stripe from 'stripe';

// Forcer l'utilisation de la version API spécifiée
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StripeApiVersion = '2024-04-10' | any;

const stripeConfig = {
  apiVersion: '2024-04-10' as StripeApiVersion, // Version spécifiée dans le dashboard
  appInfo: {
    name: 'SupperShred Webhook',
    version: '1.0.0',
  },
};

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, stripeConfig); 