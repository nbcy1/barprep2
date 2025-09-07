import Navbar from "../components/Navbar";
import ProgressChart from "../components/ProgressChart";
import WeakAreasChart from "../components/WeakAreasChart";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Your Dashboard</h1>
        <WeakAreasChart />
        <ProgressChart />
      </main>
    </>
  );
}
