import { useAuth } from "../context/AuthContext";

export default function Tasks() {
  const { logout } = useAuth();
  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <button className="px-3 py-2 rounded-lg border" onClick={logout}>Logout</button>
      </div>
      <p className="text-gray-600">Mốc 2 sẽ hiển thị danh sách & CRUD tasks.</p>
    </div>
  );
}
