import prisma from '../lib/prisma';

async function main() {
  const response = await Promise.all([
    prisma.users.upsert({
      where: { email: 'test_user@mail.com' },
      update: {},
      create: {
        name: 'test_user',
        email: '',
        image: '',
      },
    }),
  ]);
  console.log(response);
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
