import prisma from '../lib/prisma';

async function main() {
  const response = await Promise.all([
    prisma.users.upsert({
      where: { email: 'test_user@mail.com' },
      update: {},
      create: {
        name: 'test_user',
        email: 'pedrohba18@gmail.com',
        image: '',
        password: "123",
        walletAddress: "0xCB149308B6be829fD580Ff1c84Fb6C44C373B3FB"
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
