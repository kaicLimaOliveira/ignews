import { loadStripe } from '@stripe/stripe-js'

export async function getStripeJs() {
  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? ''
  const stripeJs = await loadStripe(stripePublicKey)

  return stripeJs;
}