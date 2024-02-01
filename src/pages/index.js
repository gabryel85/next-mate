import Link from 'next/link';

export default function Home() {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden'>
				<img
					className='w-full h-56 object-cover object-center'
					src='https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
					alt='Todo List'
				/>
				<div className='p-4'>
					<h2 className='text-2xl font-bold text-center mb-4'>Todo List</h2>
					<p className='text-gray-600 text-center mb-8'>Organize your tasks efficiently</p>
					<div className='flex justify-center'>
						<Link href='/todos'>
							<span className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
								View Todo List
							</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
