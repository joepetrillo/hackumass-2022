import { Button, Spinner } from "flowbite-react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import CreateGroupModal from "../components/CreateGroupModal";
import GroupCard from "../components/GroupCard";
import Head from "next/head";
import JoinGroupModal from "../components/JoinGroupModal";
import authenticateUserServerSide from "../server/common/authenticateUserServerSide";
import { trpc } from "../utils/trpc";
import { useState } from "react";

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {

  const { isLoading, isError, data } = trpc.groups.getGroupsByUserId.useQuery();
  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [joinIsOpen, setJoinIsOpen] = useState(false);

  const ownedGroupList =
    data &&
    !isError &&
    data.ownedGroups.map((curr) => <GroupCard key={curr.id} group={curr} />);

  const joinedGroupList =
    data &&
    !isError &&
    data.joinedGroups.map((curr) => <GroupCard key={curr.id} group={curr} />);

  return (
    <>
      <Head>
        <title>HackUMass 2022</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="py-2 text-2xl font-bold">Owned Groups</h2>
            <Button onClick={() => setCreateIsOpen(!createIsOpen)} size="sm">
              Create Group
            </Button>
            <CreateGroupModal
              show={createIsOpen}
              onClose={() => setCreateIsOpen(!createIsOpen)}
            />
          </div>
          <hr />
          <div className="py-6">
            {isLoading ? (
              <Spinner size="lg" />
            ) : data && data.ownedGroups.length === 0 ? (
              <p>You have not created any groups.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {ownedGroupList}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="py-2 text-2xl font-bold">Joined Groups</h2>
            <Button onClick={() => setJoinIsOpen(!joinIsOpen)} size="sm">
              Join Group
            </Button>
            <JoinGroupModal
              show={joinIsOpen}
              onClose={() => setJoinIsOpen(!joinIsOpen)}
            />
          </div>
          <hr />
          <div className="py-6">
            {isLoading ? (
              <Spinner size="lg" />
            ) : data && data.joinedGroups.length === 0 ? (
              <p>You have not joined any groups.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {joinedGroupList}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await authenticateUserServerSide(context);
};

export default Home;
