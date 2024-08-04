// lib/authHelpers.ts
import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';
import { verify } from 'jsonwebtoken';

const secret = process.env.ACCESS_TOKEN_SECRET!;

export const withAuth = async (context: GetServerSidePropsContext) => {
    const { accessToken } = parseCookies(context);

  if (!accessToken) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  try {
    verify(accessToken, secret);
    return { props: {} };
  } catch (err) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }
};
