import { useEffect } from "react";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import authenticateUserServerSide from "../../server/common/authenticateUserServerSide";
import { GetServerSidePropsContext } from "next";

const Group = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { groupId } = router.query;

  const { isLoading, isError, data } = trpc.groups.getGroupByGroupId.useQuery({
    groupId: groupId as string,
  });

  return (
    <>
      {data?.isOwner ? (
        <h1> OWNED PAGE + {groupId}</h1>
      ) : (
        <h1> NOT ONWER PAGE + {groupId}</h1>
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
