// claeefabx0000b0lo9h8skgnt
// claeen3wp0000updkyzzftzq1
// claeenhjq0005updkha6a7y17
// claefv94f0000cq8n4o50gr3j

// joe jack sid ashir

import { prisma } from "../src/server/db/client";

const groups = [
  {
    name: "Footer Design Class",
    description: "Design epic footers as taught by Professor Joe",
    ownerId: "claeefabx0000b0lo9h8skgnt",
  },
  {
    name: "Sample Chopping Class",
    description: "You have to use Abelton for this class",
    ownerId: "claeen3wp0000updkyzzftzq1",
  },
  {
    name: "Car Theft",
    description: "Sid will teach you how to make money",
    ownerId: "claeenhjq0005updkha6a7y17",
  },
  {
    name: "Auth for noobs",
    description: "Ashir will teach you auth in 30 seconds or less",
    ownerId: "claefv94f0000cq8n4o50gr3j",
  },
];

async function main() {
  groups.forEach(async (group) => {
    await prisma.group.create({
      data: {
        name: group.name,
        description: group.description,
        ownerId: group.ownerId,
      },
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
