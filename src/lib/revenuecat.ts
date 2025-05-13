import axios from 'axios';

// Configuration de l'API RevenueCat
const REVENUECAT_API_BASE = 'https://api.revenuecat.com/v1';
const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY as string;

/**
 * Accorde un entitlement à un utilisateur dans RevenueCat
 * 
 * @param appUserId Identifiant de l'utilisateur dans RevenueCat
 * @param entitlementId Identifiant de l'entitlement à accorder
 * @param productId Identifiant du produit Stripe (optionnel)
 * @returns Promise<boolean> Réussite de l'opération
 */
export async function grantEntitlementToUser(
  appUserId: string,
  entitlementId: string,
  productId?: string
): Promise<boolean> {
  try {
    // Déterminer la durée en fonction du produit
    const duration = 'annual'; // Par défaut
    
    console.log(`🔄 Octroi de l'entitlement "${entitlementId}" à l'utilisateur "${appUserId}"`);
    
    // Appeler l'API RevenueCat pour accorder l'entitlement
    const response = await axios.post(
      `${REVENUECAT_API_BASE}/subscribers/${appUserId}/entitlements/${entitlementId}`,
      {
        duration: duration,
        start_time: new Date().toISOString(),
        // ID de produit Stripe comme référence externe (optionnel)
        ...(productId && { product_identifier: productId }),
      },
      {
        headers: {
          'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Platform': 'stripe',
        },
      }
    );
    
    if (response.status === 200 || response.status === 201) {
      console.log(`✅ Entitlement "${entitlementId}" accordé avec succès`);
      return true;
    } else {
      console.error(`❌ Échec de l'octroi d'entitlement: ${response.status} ${response.statusText}`);
      console.error(response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'octroi d\'entitlement:', error);
    return false;
  }
}

/**
 * Révoque un entitlement d'un utilisateur dans RevenueCat
 * Utilisé lors d'un remboursement ou d'une annulation
 */
export async function revokeEntitlementFromUser(
  appUserId: string,
  entitlementId: string
): Promise<boolean> {
  try {
    console.log(`🔄 Révocation de l'entitlement "${entitlementId}" pour l'utilisateur "${appUserId}"`);
    
    // Appeler l'API RevenueCat pour révoquer l'entitlement
    const response = await axios.delete(
      `${REVENUECAT_API_BASE}/subscribers/${appUserId}/entitlements/${entitlementId}`,
      {
        headers: {
          'Authorization': `Bearer ${REVENUECAT_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Platform': 'stripe',
        },
      }
    );
    
    if (response.status === 200 || response.status === 204) {
      console.log(`✅ Entitlement "${entitlementId}" révoqué avec succès`);
      return true;
    } else {
      console.error(`❌ Échec de la révocation d'entitlement: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la révocation d\'entitlement:', error);
    return false;
  }
} 