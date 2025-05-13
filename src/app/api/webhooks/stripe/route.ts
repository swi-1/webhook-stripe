import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { grantEntitlementToUser, revokeEntitlementFromUser } from '@/lib/revenuecat';
import { Readable } from 'stream';

// Conversion d'un flux de données en chaîne
async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Fonction utilitaire pour mapper les produits Stripe aux entitlements
function mapStripeProductToEntitlement(productId: string): string {
  const productMappings: Record<string, string> = {
    'prod_SBPjLm5yyvXx33': 'muscu',  // Produit Musculation Annuel
    // Ajoutez d'autres mappings au besoin
  };
  
  return productMappings[productId] || 'muscu'; // Par défaut, renvoyez 'muscu'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    if (!signature || !webhookSecret) {
      console.error('❌ Signature du webhook ou secret manquant');
      return NextResponse.json(
        { error: 'Signature du webhook ou secret manquant' },
        { status: 400 }
      );
    }

    // Vérification de la signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`❌ Erreur de signature webhook: ${err.message}`);
      return NextResponse.json(
        { error: `Signature webhook: ${err.message}` },
        { status: 400 }
      );
    }

    console.log(`🔔 Événement Stripe reçu: ${event.type}`);

    // Traitement des événements
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      default:
        console.log(`⚠️ Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Erreur de traitement du webhook:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/**
 * Gère un paiement réussi - Accorde l'entitlement à l'utilisateur
 */
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log('✅ Paiement réussi:', paymentIntent.id);
    
    const metadata = paymentIntent.metadata || {};
    
    // Récupérer les données importantes des métadonnées
    const appUserId = metadata.app_user_id;
    const productId = metadata.product_id;
    const entitlement = metadata.entitlement || mapStripeProductToEntitlement(productId);
    
    if (!appUserId) {
      console.error('❌ app_user_id manquant dans les métadonnées du paiement');
      return;
    }
    
    if (!entitlement) {
      console.error('❌ entitlement manquant et impossible à déterminer');
      return;
    }
    
    console.log(`🔄 Traitement de l'entitlement "${entitlement}" pour l'utilisateur "${appUserId}"`);
    
    // Accorder l'entitlement à l'utilisateur dans RevenueCat
    const success = await grantEntitlementToUser(appUserId, entitlement, productId);
    
    if (success) {
      console.log('✅ Entitlement accordé avec succès');
    } else {
      console.error('❌ Échec de l\'attribution de l\'entitlement');
    }
  } catch (error) {
    console.error('❌ Erreur lors du traitement du paiement réussi:', error);
  }
}

/**
 * Gère un paiement échoué
 */
async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('❌ Paiement échoué:', paymentIntent.id);
  // Pas d'action spécifique nécessaire car aucun entitlement n'a été accordé
}

/**
 * Gère un remboursement - Révoque l'entitlement de l'utilisateur
 */
async function handleChargeRefunded(charge: any) {
  try {
    console.log('💸 Remboursement détecté:', charge.id);
    
    // Récupérer le payment_intent associé à cette charge
    const paymentIntentId = charge.payment_intent;
    if (!paymentIntentId) {
      console.error('❌ Pas de payment_intent associé à cette charge');
      return;
    }
    
    // Récupérer les détails du payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const metadata = paymentIntent.metadata || {};
    
    const appUserId = metadata.app_user_id;
    const productId = metadata.product_id;
    const entitlement = metadata.entitlement || mapStripeProductToEntitlement(productId);
    
    if (!appUserId) {
      console.error('❌ app_user_id manquant dans les métadonnées du paiement');
      return;
    }
    
    if (!entitlement) {
      console.error('❌ entitlement manquant et impossible à déterminer');
      return;
    }
    
    console.log(`🔄 Révocation de l'entitlement "${entitlement}" pour l'utilisateur "${appUserId}" suite à un remboursement`);
    
    // Révoquer l'entitlement de l'utilisateur dans RevenueCat
    const success = await revokeEntitlementFromUser(appUserId, entitlement);
    
    if (success) {
      console.log('✅ Entitlement révoqué avec succès');
    } else {
      console.error('❌ Échec de la révocation de l\'entitlement');
    }
  } catch (error) {
    console.error('❌ Erreur lors du traitement du remboursement:', error);
  }
}

// Configuration pour les options de header HTTP de la route
export const OPTIONS = {
  runtime: 'edge',
}; 