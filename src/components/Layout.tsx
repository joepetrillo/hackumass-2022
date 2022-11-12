import { Dropdown, Footer, Navbar } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <>
      <Navbar
        fluid={true}
        rounded={true}
        className="mx-auto max-w-screen-md !px-10 !py-10"
      >
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
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
                width={55}
                height={55}
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
            <Link
              href="/settings"
              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Settings
            </Link>
            <Dropdown.Divider />
            <Link
              href="/api/auth/signout"
              className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Sign Out
            </Link>
          </Dropdown>
        </div>
      </Navbar>
      {children}
      <Footer>
        <div className="mx-auto w-full max-w-screen-md">
          <div className="grid w-full grid-cols-2 gap-8 py-8 px-6 md:grid-cols-3">
            <div>
              <Footer.Title title="Group" />
              <Footer.LinkGroup col={true}>
                <li>
                  <Link
                    target="_blank"
                    href="https://github.com/joepetrillo"
                    className="inline hover:underline"
                  >
                    Joe Petrillo
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://github.com/LinkFrost"
                    className="inline hover:underline"
                  >
                    Ashir Imran
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://github.com/sid2033"
                    className="inline hover:underline"
                  >
                    Siddarth Raju
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://github.com/jackbisceglia"
                    className="inline hover:underline"
                  >
                    Jack Bisceglia
                  </Link>
                </li>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Company" />
              <Footer.LinkGroup col={true}>
                <li>
                  <Link href="/about" className="inline hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="inline hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    target="_blank"
                    href="https://github.com/joepetrillo/hackumass-2022"
                    className="inline hover:underline"
                  >
                    Contribute
                  </Link>
                </li>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="legal" />
              <Footer.LinkGroup col={true}>
                <li>
                  <Link
                    href="/termsofservice"
                    className="inline hover:underline"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacypolicy"
                    className="inline hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
      </Footer>
    </>
  );
};

export default Layout;
