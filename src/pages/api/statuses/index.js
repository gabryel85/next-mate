import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		try {
			const statuses = await prisma.status.findMany();
			res.status(200).json(statuses);
		} catch (error) {
			res.status(500).json({ message: 'Something went wrong', error: error.message });
		}
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
