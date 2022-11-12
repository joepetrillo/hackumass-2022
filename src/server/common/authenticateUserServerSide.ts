import type { GetServerSidePropsContext } from "next";
import type { Session } from "next-auth";
import { getServerAuthSession } from "./get-server-auth-session";

// Checks auth status. If user is not authenticated, redirects to login page
// Optional getPropsCallback, which is invoked and can return extra props to be passed to the page
const authenticateUserServerSide = async (
  ctx: GetServerSidePropsContext,
  getPropsCallback: (
    session: Session
  ) => Promise<{ props: Record<string, unknown> }> = async () => ({ props: {} })
) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const { props: nonSessionProps } = await getPropsCallback(session);

  return {
    props: {
      session: session,
      ...nonSessionProps,
    },
  };
};

export default authenticateUserServerSide;
