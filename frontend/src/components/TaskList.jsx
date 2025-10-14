import React from "react";

export default function TaskList({ tasks = [] }) {
	if (!tasks.length) return (
		<div className="p-4 text-center text-gray-500">No tasks yet</div>
	);

	return (
		<ul className="space-y-2">
			{tasks.map((t) => (
				<li key={t.id} className="p-3 border rounded-lg flex justify-between items-center">
					<span>{t.title}</span>
					<span className="text-sm text-gray-400">{t.completed ? 'Done' : 'Open'}</span>
				</li>
			))}
		</ul>
	);
}
