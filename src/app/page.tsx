import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-3xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-center mb-8">
          <div className="p-4 bg-blue-500 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-10 h-10 text-white"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
          Webhook Stripe-RevenueCat
        </h1>
        
        <div className="p-4 mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg">
          <p className="text-center text-green-700 dark:text-green-400">
            Le webhook est actif et en attente d'événements Stripe
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Configuration du Webhook
          </h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
              URL: https://votre-domaine.com/api/webhooks/stripe
            </code>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Événements traités
          </h2>
          <ul className="space-y-2">
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5 mr-2 text-green-500"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="m4.5 12.75 6 6 9-13.5" 
                />
              </svg>
              payment_intent.succeeded
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5 mr-2 text-green-500"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="m4.5 12.75 6 6 9-13.5" 
                />
              </svg>
              payment_intent.payment_failed
            </li>
            <li className="flex items-center text-gray-700 dark:text-gray-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5 mr-2 text-green-500"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="m4.5 12.75 6 6 9-13.5" 
                />
              </svg>
              charge.refunded
            </li>
          </ul>
        </div>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Ce webhook est configuré pour synchroniser les paiements Stripe avec les entitlements RevenueCat.
        </p>
      </div>
    </div>
  );
}
