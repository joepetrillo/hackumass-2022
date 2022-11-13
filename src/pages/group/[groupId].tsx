import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import authenticateUserServerSide from "../../server/common/authenticateUserServerSide";
import type { GetServerSidePropsContext } from "next";
import { Button, Spinner } from "flowbite-react";
import JoinSessionForm from "../../components/JoinSession";
import ActiveSessions from "../../components/ActiveSessions";
import CreateSessionModal from "../../components/CreateSessionModal";
import { useState } from "react";

const Group = () => {
  const [createIsOpen, setCreateIsOpen] = useState(false);
  const toggleOpen = () => setCreateIsOpen(!createIsOpen);
  const router = useRouter();
  const { groupId } = router.query;

  const { isLoading, isError, data, error } =
    trpc.groups.getGroupByGroupId.useQuery({
      groupId: groupId as string,
    });

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="py-2 text-2xl font-bold sm:text-3xl">
            {data.groupData?.name}
          </h2>
          <span className="text-gray-600">
            Owned by {data.groupData?.ownerName}
          </span>
        </div>
        {data.isOwner && (
          <>
            <Button onClick={toggleOpen} size="sm" className="shrink-0">
              Create Session
            </Button>
            <CreateSessionModal
              groupId={data.groupData.id}
              show={createIsOpen}
              toggleOpen={toggleOpen}
            />
          </>
        )}
      </div>
      <hr className="my-4" />
      {data.isOwner ? (
        <ActiveSessions groupId={data.groupData.id} />
      ) : (
        <JoinSessionForm />
      )}
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return await authenticateUserServerSide(context);
};
export default Group;
