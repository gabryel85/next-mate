import { prisma } from '@/lib/prisma';

export async function get(req, res) {
  const todos = await prisma.todo.findMany({
      include: {
          user: true, 
          status: true, 
      },
  });
  res.status(200).json(todos);
}

export async function post(req, res) {
	const { title, content, userId, statusId } = req.body;
	const newTodo = await prisma.todo.create({
		data: {
			title,
			content,
			userId,
			statusId,
		},
	});
	res.status(201).json(newTodo);
}

export default function handler(req, res) {
	if (req.method === 'GET') {
		get(req, res);
	} else if (req.method === 'POST') {
		post(req, res);
	} else {
		res.setHeader('Allow', ['GET', 'POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
