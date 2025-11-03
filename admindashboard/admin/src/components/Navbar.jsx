export default function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <button className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
        Logout
      </button>
    </div>
  );
}
