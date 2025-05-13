import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Utilisez la dernière version disponible
  appInfo: {
    name: 'SupperShred Webhook',
    version: '1.0.0',
  },
}); 