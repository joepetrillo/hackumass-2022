import { useEffect } from "react";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [session, router, status]);

  return (
    <>
      <Head>
        <title>HackUMass 2022</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {status !== "loading" && status !== "authenticated" && (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl text-black">Login</h1>
          <button
            onClick={() => signIn("github")}
            className="my-6 rounded-lg border-2 border-black px-4 py-2 text-xl"
          >
            Sign In With Github
          </button>
        </div>
      )}
    </>
  );
};

export default Login;
