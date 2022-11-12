import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { Dropdown, Navbar } from "flowbite-react";
import Head from "next/head";
import Image from "next/image";
import authenticateUserServerSide from "../server/common/authenticateUserServerSide";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>HackUMass 2022</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            HackUmass
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Image
                alt="avatar"
                src={session?.user?.image ?? ""}
                width={60}
                height={60}
                className="rounded-full"
              ></Image>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{session?.user?.name}</span>
              <span className="block truncate text-sm font-medium">
                {session?.user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>
              <Link href="/settings" className="w-full">
                Settings
              </Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Link href="/api/auth/signout" className="w-full">
                Sign Out
              </Link>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await authenticateUserServerSide(context);
};

export default Home;
