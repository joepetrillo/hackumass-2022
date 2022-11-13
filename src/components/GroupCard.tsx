import type { Group } from "@prisma/client";
import { Card } from "flowbite-react";
import Link from "next/link";

const GroupCard = ({ group }: { group: Group }) => {
  return (
    <Link
      href={`/group/${group.id}`}
      className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="flex h-full flex-col justify-center gap-4 p-6">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {group.name}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {group.description}
        </p>
      </div>
    </Link>
  );
};

export default GroupCard;
