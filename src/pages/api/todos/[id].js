import { prisma } from '@/lib/prisma';

// GET api/todos/:id
export async function get(req, res) {
	const { id } = req.query;
	const todo = await prisma.todo.findUnique({
		where: { id: parseInt(id) },
		include: {
			user: true,
			status: true,
		},
	});
	res.status(200).json(todo);
}

// PUT api/todos/:id
export async function put(req, res) {
	const { id } = req.query;
	const { title, content, userId, statusId } = req.body;
	const updatedTodo = await prisma.todo.update({
		where: { id: parseInt(id) },
		data: {
			title,
			content,
			userId,
			statusId,
		},
	});
	res.status(200).json(updatedTodo);
}

// DELETE api/todos/:id
export async function del(req, res) {
	const { id } = req.query;
	await prisma.todo.delete({
		where: { id: parseInt(id) },
	});
	res.status(204).end();
}

export default function handler(req, res) {
	switch (req.method) {
		case 'GET':
			get(req, res);
			break;
		case 'PUT':
			put(req, res);
			break;
		case 'DELETE':
			del(req, res);
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
