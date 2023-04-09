// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    const id = Number(req.query.id);
    const updateLayout = await prisma.User.update({
      where: {
        id: id,
      },
      data: {
        layout: JSON.stringify(req.body.data),
      },
    });
    return await res.json(updateLayout);
}

