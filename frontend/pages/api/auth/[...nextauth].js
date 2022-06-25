import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

async function refreshAccessToken(token) {
  try {
    const refreshTokenURL = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/v1/auth/token/refresh/`;
    const response = await axios.post(refreshTokenURL, {
      refresh: token.refreshToken,
    });

    const { access: access_token } = response.data;

    const response2 = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/v1/auth/user/`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userAccount = response2.data;

    return {
      refreshToken: token.refreshToken,
      accessToken: access_token,
      account: userAccount,
    };
  } catch (error) {}
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "email",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/v1/auth/login/`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );
          const user = response.data.user;

          user.accessToken = response.data.access_token;
          user.refreshToken = response.data.refresh_token;

          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider == "credentials") {
        if (user) {
          return true;
        }
        return false;
      }
      return false;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        const { accessToken, refreshToken } = user;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
      }

      return refreshAccessToken(token);
    },
    async session({ session, user, token }) {
      session.user = token.account;
      session.accessToken = token.accessToken;

      return session;
    },
  },
  events: {
    async signOut({ token }) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/v1/auth/logout/`,
          {
            refresh: token.refreshToken,
          }
        );
      } catch (error) {}
    },
  },
  // pages: {
  //   signIn: '/login'
  // }
});
