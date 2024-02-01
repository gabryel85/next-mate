import axios from 'axios';
import TodoForm from '@/components/TodoForm';
import { useRouter } from 'next/router';

export default function TodoDetails({ todo }) {
	const router = useRouter();

	const handleSubmit = async data => {
		await axios.put(`api/todos/${todo.id}`, data);
		router.push('/');
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-xl font-bold mb-4'>Edit Todo</h1>
			<TodoForm onSubmit={handleSubmit} initialData={todo} />
		</div>
	);
}

export async function getServerSideProps({ params }) {
	const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/todos/${params.id}`);
	const todo = res.data;

	return {
		props: { todo },
	};
}
