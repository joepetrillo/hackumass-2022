import { GroupSession } from "@prisma/client";
import { Card, Spinner } from "flowbite-react";
import { trpc } from "../utils/trpc";

const ActiveSessions = ({ groupId }: { groupId: string }) => {
  const { data, isLoading, isError } =
    trpc.groupSessions.getSessionsByGroupId.useQuery({
      groupId: groupId,
    });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p>no sessions</p>;
  }

  const SessionList = data.map((s) => (
    <Card key={s.id}>
      <div className="flex h-full flex-col justify-start gap-4 p-6">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {s.name}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {s.createdAt.toDateString()}
        </p>
      </div>
    </Card>
  ));
  return (
    <div>
      <h3 className="text-lg">Active Sessions</h3>
      {SessionList.length ? (
        SessionList
      ) : (
        <p className="py-1 text-red-400">
          No Active Sessions. Create one to get started.
        </p>
      )}
    </div>
  );
};

export default ActiveSessions;
