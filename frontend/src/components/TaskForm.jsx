import React, { useState } from "react";

export default function TaskForm({ onCreate = () => {} }) {
	const [title, setTitle] = useState("");

	const submit = (e) => {
		e.preventDefault();
		if (!title.trim()) return;
		onCreate({ id: Date.now(), title: title.trim(), completed: false });
		setTitle("");
	};

	return (
		<form onSubmit={submit} className="space-x-2 flex">
			<input
				className="input flex-1"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="New task title"
			/>
			<button className="btn" type="submit">Add</button>
		</form>
	);
}
