// components/TodoForm.js
import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export default function TodoForm({ onSubmit, initialData = {} }) {
	const { data: users } = useSWR('/api/users', fetcher);
	const { data: statuses } = useSWR('/api/statuses', fetcher);

	const [formData, setFormData] = useState({
		title: initialData.title || '',
		content: initialData.content || '',
		userId: initialData.userId || '',
		statusId: initialData.statusId || '',
	});

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = e => {
		e.preventDefault();
		const dataToSubmit = {
			...formData,
			userId: parseInt(formData.userId, 10),
			statusId: parseInt(formData.statusId, 10),
		};
		onSubmit(dataToSubmit);
	};

	return (
		<div className='max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md text-gray-700'>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='title' className='block text-sm font-medium text-gray-700'>
						Title
					</label>
					<input
						type='text'
						id='title'
						name='title'
						value={formData.title}
						onChange={handleChange}
						required
						className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
					/>
				</div>
				<div>
					<label htmlFor='content' className='block text-sm font-medium text-gray-700'>
						Content
					</label>
					<textarea
						id='content'
						name='content'
						value={formData.content}
						onChange={handleChange}
						rows='4'
						className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'></textarea>
				</div>
				<div>
					<label htmlFor='userId' className='block text-sm font-medium text-gray-700'>
						User
					</label>
					<select
						id='userId'
						name='userId'
						value={formData.userId}
						onChange={handleChange}
						required
						className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'>
						<option value=''>Select a user</option>
						{users?.map(user => (
							<option key={user.id} value={user.id}>
								{user.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor='statusId' className='block text-sm font-medium text-gray-700'>
						Status
					</label>
					<select
						id='statusId'
						name='statusId'
						value={formData.statusId}
						onChange={handleChange}
						required
						className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'>
						<option value=''>Select a status</option>
						{statuses?.map(status => (
							<option key={status.id} value={status.id}>
								{status.name}
							</option>
						))}
					</select>
				</div>
				<button type='submit' className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700'>
					Submit
				</button>
			</form>
		</div>
	);
}
