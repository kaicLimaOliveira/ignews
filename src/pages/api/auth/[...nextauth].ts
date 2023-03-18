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
  ]
})