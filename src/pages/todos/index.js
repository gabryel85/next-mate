import Link from 'next/link';
import axios from 'axios';

export default function Home({ todos }) {
	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Todo List</h1>
			<Link href='/todos/new'>
				<span className='mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors'>
					Add Todo
				</span>
			</Link>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{todos.map(todo => (
					<div
						key={todo.id}
						className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
						<div className='p-4'>
							<h2 className='text-lg font-semibold text-blue-500 hover:text-blue-600 transition-colors'>
								<Link href={`/todos/${todo.id}`}>
									<span>{todo.title}</span>
								</Link>
							</h2>
							<p className='text-gray-700'>{todo.content}</p>
						</div>
						<div className='px-4 py-2 bg-gray-100'>
							<Link href={`/todos/${todo.id}`}>
								<span className='text-sm text-blue-500 hover:text-blue-600 transition-colors'>View Details &rarr;</span>
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/todos`);
	const todos = res.data;

	return {
		props: { todos },
	};
}
