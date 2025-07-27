export async function getStripe() {
  // Only check for environment variable at runtime, not build time
  if (typeof window !== 'undefined') {
    throw new Error('Stripe should only be used on the server side');
  }
  
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey || secretKey === 'sk_build_dummy_key_for_build_process') {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  
  // Dynamic import to avoid build-time evaluation
  const Stripe = (await import('stripe')).default;
  
  return new Stripe(secretKey, {
    apiVersion: '2023-10-16',
  });
}

// For backward compatibility, also export as default
export default getStripe;