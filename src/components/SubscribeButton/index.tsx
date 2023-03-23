import { api } from "@/services/api";
import { getStripeJs } from "@/services/stripe-js";
import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data } = useSession()

  async function handleSubscribe() {
    if (!data) {
      signIn('github')
      return
    }

    try {
      const response = await api.post('/subscribe')
      const { sessionId } = response.data

      const stripe = await getStripeJs()
      await stripe?.redirectToCheckout({ sessionId })

    } catch (err: any) {
      console.log(err);

      alert(err.message);
    }
  }

  return (
    <button type="button" onClick={() => handleSubscribe()} className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}