import type { Group } from "@prisma/client";
import { Card } from "flowbite-react";

const GroupCard = ({ group }: { group: Group }) => {
  return (
    <Card href="#">
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {group.name}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {group.description}
      </p>
    </Card>
  );
};

export default GroupCard;
