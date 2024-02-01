import TodoForm from '../../components/TodoForm';
import { useRouter } from 'next/router';

export default function NewTodo() {
	const router = useRouter();

	const handleSubmit = async data => {
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		router.push('/todos');
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-xl font-bold mb-4'>Add New Todo</h1>
			<TodoForm onSubmit={handleSubmit} />
		</div>
	);
}
