import { api } from "@/services/api";
import { getStripeJs } from "@/services/stripe-js";
import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data }: any = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!data) {
      signIn('github')
      return
    }

    if (data.activeSubscription) {
      router.push('/posts');
      return;
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