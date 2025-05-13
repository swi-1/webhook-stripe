# Webhook Stripe pour RevenueCat

Ce projet est un serveur webhook qui permet de synchroniser les paiements Stripe avec RevenueCat pour gérer les entitlements de votre application mobile.

## Fonctionnalités

- Traitement des événements webhook Stripe
- Attribution automatique des entitlements dans RevenueCat après un paiement réussi
- Révocation des entitlements en cas de remboursement
- Journalisation détaillée pour le débogage

## Prérequis

- Node.js 18+ et npm
- Un compte Stripe avec une clé API
- Un compte RevenueCat avec une clé API
- Un accès à un service d'hébergement (Vercel, Heroku, etc.)

## Configuration

1. **Cloner le projet et installer les dépendances**

```bash
git clone <repository-url>
cd webhook_stripe
npm install
```

2. **Configurer les variables d'environnement**

Copiez le fichier `.env.example` en `.env.local` :

```bash
cp .env.example .env.local
```

Puis modifiez ce fichier avec vos propres clés API :

```
STRIPE_SECRET_KEY=sk_live_votre_cle_secrete_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_cle_webhook_stripe
REVENUECAT_API_KEY=sk_votre_cle_api_revenuecat
```

3. **Démarrer le serveur en local**

```bash
npm run dev
```

4. **Exposer le serveur local pour les tests (optionnel)**

Vous pouvez utiliser des outils comme [ngrok](https://ngrok.com/) pour exposer votre serveur local :

```bash
ngrok http 3000
```

## Configuration de Stripe

1. Accédez au [Dashboard Stripe](https://dashboard.stripe.com/webhooks)
2. Ajoutez un nouvel endpoint pour votre webhook
3. Entrez l'URL de votre serveur (ex: `https://votre-serveur.com/api/webhooks/stripe`)
4. Sélectionnez les événements suivants :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copiez la clé de signature du webhook et ajoutez-la à votre fichier `.env.local`

## Configuration de l'application mobile

Dans votre application Flutter, assurez-vous d'inclure les métadonnées suivantes lors de la création d'un PaymentIntent :

```dart
final response = await http.post(
  Uri.parse('https://api.stripe.com/v1/payment_intents'),
  headers: {
    'Authorization': 'Bearer sk_live_votre_cle_secrete_stripe',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: {
    'amount': '3590', // Montant en centimes
    'currency': 'eur',
    'payment_method_types[]': 'card',
    'metadata[product_id]': 'prod_SBPjLm5yyvXx33', // ID du produit
    'metadata[app_user_id]': 'user_id_revenuecat', // ID utilisateur RevenueCat
    'metadata[entitlement]': 'muscu', // ID de l'entitlement
  },
);
```

## Déploiement

### Déploiement sur Vercel

La façon la plus simple de déployer ce webhook est d'utiliser Vercel :

1. Créez un compte sur [Vercel](https://vercel.com/)
2. Connectez votre repository Git
3. Configurez les variables d'environnement
4. Déployez le projet

### Déploiement sur Heroku

Vous pouvez également déployer sur Heroku :

1. Créez un compte sur [Heroku](https://heroku.com/)
2. Installez l'[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Exécutez les commandes suivantes :

```bash
heroku create
heroku config:set STRIPE_SECRET_KEY=sk_live_votre_cle_secrete_stripe
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_votre_cle_webhook_stripe
heroku config:set REVENUECAT_API_KEY=sk_votre_cle_api_revenuecat
git push heroku main
```

## Dépannage

### Problèmes courants

1. **Les entitlements ne sont pas attribués**
   - Vérifiez les logs du serveur webhook
   - Assurez-vous que les métadonnées sont correctement définies
   - Vérifiez que les clés API sont valides

2. **Erreurs de signature webhook**
   - Vérifiez que la clé de signature webhook est correcte
   - Assurez-vous que le corps de la requête n'est pas modifié

3. **Erreurs d'API RevenueCat**
   - Vérifiez les logs pour les détails de l'erreur
   - Assurez-vous que l'ID utilisateur existe dans RevenueCat
   - Vérifiez que l'entitlement existe dans votre projet RevenueCat

## Logs

Les logs détaillés sont essentiels pour le débogage. En production, vous pouvez consulter les logs via :

- Vercel : Dashboard du projet > Logs
- Heroku : `heroku logs --tail`

## Support

Pour toute question ou problème, contactez l'équipe de développement.
