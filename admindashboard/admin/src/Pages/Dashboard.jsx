import DashboardCard from "../components/DashboardCard";

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <DashboardCard title="Total Products" value="125" />
      <DashboardCard title="Users" value="56" />
      <DashboardCard title="Orders" value="87" />
    </div>
  );
}
