import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { cryptocurrencyValidationSchema } from 'validationSchema/cryptocurrencies';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.cryptocurrency
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCryptocurrencyById();
    case 'PUT':
      return updateCryptocurrencyById();
    case 'DELETE':
      return deleteCryptocurrencyById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCryptocurrencyById() {
    const data = await prisma.cryptocurrency.findFirst(convertQueryToPrismaUtil(req.query, 'cryptocurrency'));
    return res.status(200).json(data);
  }

  async function updateCryptocurrencyById() {
    await cryptocurrencyValidationSchema.validate(req.body);
    const data = await prisma.cryptocurrency.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCryptocurrencyById() {
    const data = await prisma.cryptocurrency.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
