import Stripe from "stripe";
import packageJson from "../../package.json"

const stripeApiKey = process.env.STRIPE_API_KEY;

if (!stripeApiKey) {
  throw new Error("Stripe API key not found");
}

export const stripe = new Stripe(
  stripeApiKey,
  {
    apiVersion: "2022-11-15",
    appInfo: {
      name: "Ignews",
      version: packageJson.version
    }
  }
);