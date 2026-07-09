import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Cuenta admin inicial. Se puede sobreescribir con variables de entorno
// al correr el script, ej:
//   ADMIN_EMAIL=otro@correo.com ADMIN_PASSWORD=otraClave npm run seed
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rommie.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador';

async function main() {

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const existingUser = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
    include: { roles: { include: { role: true } } },
  });

  if (existingUser) {

    const alreadyAdmin = existingUser.roles.some(
      (userRole) => userRole.role.name === 'admin'
    );

    if (alreadyAdmin) {
      console.log(`"${ADMIN_EMAIL}" ya es admin, nada que hacer.`);
      return;
    }

    await prisma.userRole.create({
      data: {
        userId: existingUser.id,
        roleId: adminRole.id,
      },
    });

    console.log(`Se agregó el rol admin a "${ADMIN_EMAIL}".`);
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      verificationStatus: 'APPROVED',
      verifiedAt: new Date(),
      profile: {
        create: { name: ADMIN_NAME },
      },
      roles: {
        create: [{ role: { connect: { id: adminRole.id } } }],
      },
    },
  });

  console.log(
    `Cuenta admin creada: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD} (cámbiala después de iniciar sesión).`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
