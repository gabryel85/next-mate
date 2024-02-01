const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	const user1 = await prisma.user.create({
		data: {
			name: 'Alice',
			email: 'alice@example.com',
		},
	});

	const user2 = await prisma.user.create({
		data: {
			name: 'Bob',
			email: 'bob@example.com',
		},
	});

	const statusActive = await prisma.status.create({
		data: {
			name: 'Active',
		},
	});

	const statusCompleted = await prisma.status.create({
		data: {
			name: 'Completed',
		},
	});

	// Tworzenie zadań (todos)
	const todo1 = await prisma.todo.create({
		data: {
			title: 'Finish Prisma setup',
			content: 'Make sure Prisma is fully set up and ready to go.',
			userId: user1.id,
			statusId: statusActive.id,
		},
	});

	const todo2 = await prisma.todo.create({
		data: {
			title: 'Learn Next.js',
			content: 'Follow the official Next.js tutorial to understand the basics.',
			userId: user2.id,
			statusId: statusCompleted.id,
		},
	});

	console.log({ user1, user2, statusActive, statusCompleted, todo1, todo2 });
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
