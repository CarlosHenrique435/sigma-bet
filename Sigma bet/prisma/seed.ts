import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@sigmabet.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456";
  const adminName = process.env.ADMIN_NAME ?? "Administrador";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      role: Role.ADMIN,
      isBlocked: false,
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      balance: 10000,
      role: Role.ADMIN,
      isBlocked: false,
    },
  });

  await prisma.game.upsert({
    where: { slug: "coinflip" },
    update: { isActive: true },
    create: {
      name: "Coinflip",
      slug: "coinflip",
      isActive: true,
    },
  });

  console.log("Seed concluído:");
  console.log(`  Admin: ${adminEmail}`);
  console.log(`  Senha: ${adminPassword}`);
  console.log("  Jogo: coinflip");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
