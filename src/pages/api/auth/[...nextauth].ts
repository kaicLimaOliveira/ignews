import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";

import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";



interface GitHubProviderConfig {
  clientId: string;
  clientSecret: string;
  scope: string;
}

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    } as GitHubProviderConfig),
  ],
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'subscriptions',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user?.email ?? ''),
                    ),
                  ),
                ),
              ),
              q.Match(q.Index('subscription_by_status'), 'active'),
            ]),
          ),
        );

        console.log(userActiveSubscription);
        

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };

      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn({ user }): Promise<boolean> {
      const { email } = user;

      try {
        if (email) {
          await fauna.query(
            q.If(
              q.Not(
                q.Exists(
                  q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(email)
                  )
                )
              ),
              q.Create(
                q.Collection('users'),
                { data: { email } }
              ),
              q.Get(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(email)
                )
              )
            )
          )
        }
      } catch {
        return false;
      }

      return true;
    }
  }
})