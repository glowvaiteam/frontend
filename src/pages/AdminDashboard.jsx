import { useEffect, useState } from "react";
import axios from "axios";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";

/* ================= CHART SETUP ================= */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement
);

/* ================= BACKEND URL ================= */
const API = "https://glowvai-backend-v85o.onrender.com/api/admin";


function AdminDashboard() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [todayUsers, setTodayUsers] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAnalysings, setTotalAnalysings] = useState(0);
  const [timeRange, setTimeRange] = useState("Daily");
  const [search, setSearch] = useState("");

  const [lineLabels, setLineLabels] = useState([]);
  const [lineData, setLineData] = useState([]);

  const [pieChartData, setPieChartData] = useState({
    labels: ["Total Users", "Active Users"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#d1d5db", "#fbbf24"],
      },
    ],
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD DATA ================= */
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 🔹 SUMMARY
      const summaryRes = await axios.get(`${API}/summary`);
      setTotalUsers(summaryRes.data.total_users);

      setPieChartData({
        labels: ["Total Users", "Active Users"],
        datasets: [
          {
            data: [
              summaryRes.data.total_users,
              summaryRes.data.active_users,
            ],
            backgroundColor: ["#d1d5db", "#fbbf24"],
          },
        ],
      });

      // 🔹 ALL USERS
      const usersRes = await axios.get(`${API}/users`);

setAllUsers(usersRes.data);
setFilteredUsers(usersRes.data);

// 🔥 CALCULATE TOTAL ANALYSINGS
const total = usersRes.data.reduce(
  (sum, user) => sum + (user.analysis_count || 0),
  0
);
setTotalAnalysings(total);


      // 🔹 TODAY ACTIVE USERS (WITH TODAY ANALYSIS ONLY)
      const todayRes = await axios.get(`${API}/today-users`);
      setTodayUsers(todayRes.data);

      // 🔹 REGISTRATION GRAPH
      const graphRes = await axios.get(
        `${API}/registrations?range=${timeRange}`
      );
      setLineLabels(graphRes.data.labels || []);
      setLineData(graphRes.data.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTO REFRESH ================= */
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, [timeRange]);

  /* ================= SEARCH ================= */
  useEffect(() => {
    if (!search) {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(
        allUsers.filter((u) =>
          u.full_name?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, allUsers]);

  /* ================= CHART DATA ================= */
  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Registrations",
        data: lineData,
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251,191,36,0.2)",
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-yellow-500 font-semibold text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ================= HEADER ================= */}
     <header className="flex items-center justify-between px-8 py-4 border-b">
  <h1 className="text-2xl font-bold text-yellow-500 tracking-widest">
    GLOWVAI
  </h1>

  <div className="flex gap-4 items-center">
    <h2 className="text-2xl font-bold">DASHBOARD</h2>

    {/* 🔥 NEW BUTTON */}
    <button
      className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold"
      onClick={() => navigate("/admin/feedbacks")}
    >
      User Feedbacks
    </button>
  </div>

  <button
    className="bg-red-400 hover:bg-red-500 rounded-lg px-4 py-2 text-white font-semibold"
    onClick={() => {
      localStorage.removeItem("admin");
      navigate("/login", { replace: true });
    }}
  >
    Logout
  </button>
</header>

      {/* ================= TOP ANALYTICS ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
        {/* LINE GRAPH */}
        <div className="bg-gray-50 rounded-lg p-4">
          <select
            className="border rounded px-2 py-1 text-sm mb-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <Line
            data={lineChartData}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
        {/* PIE CHART */}
        <div className="bg-gray-50 rounded-lg p-4 flex justify-center items-center">
          <div className="w-72 h-72 md:w-80 md:h-80">
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
      </section>
      {/* ================= SUMMARY CARDS ================= */}
        <section className="w-full flex flex-col sm:flex-row gap-6 p-6 border-b">
          <div className="flex-1">
            <div className="bg-white border border-yellow-100 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[110px]">
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white border border-yellow-100 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[110px]">
              <p className="text-sm text-gray-500 mb-1">Total Analysings</p>
              <p className="text-3xl font-bold text-blue-500">{totalAnalysings}</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white border border-yellow-100 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center min-h-[110px]">
              <p className="text-sm text-gray-500 mb-1">Today Active Users</p>
              <p className="text-3xl font-bold text-yellow-500">{todayUsers.length}</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white border border-yellow-100 rounded-2xl shadow-sm p-6 flex flex-col justify-center min-h-[110px]">
              <p className="text-sm text-gray-500 mb-1">Search User</p>
              <input
                placeholder="Search user name"
                className="w-full border rounded px-2 py-1"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </section>
      {/* ================= BOTTOM SECTION ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 flex-1">
        {/* USER CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredUsers.map((u) => (
            <div key={u.id} className="border rounded-xl p-4 shadow">
              <p><b>Name:</b> {u.full_name}</p>
              <p><b>Mail:</b> {u.email}</p>
              <p><b>Age:</b> {u.age || "-"}</p>
              <p><b>Total Analysings:</b> {u.analysis_count || 0}</p>
            </div>
          ))}
        </div>
        {/* TODAY USERS TABLE */}
        <div className="border rounded-lg p-4 bg-white overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">S.No</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Mail</th>
              </tr>
            </thead>
            <tbody>
              {todayUsers.map((u, i) => (
                <tr key={u.id}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{u.full_name}</td>
                  <td className="border p-2">{u.email}</td>
                </tr>
              ))}
              {todayUsers.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-400">
                    No active users today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="text-center py-4 text-gray-400 border-t">
        © {new Date().getFullYear()} Glowvai Admin Dashboard
      </footer>
    </div>
  );
}

export default AdminDashboard;
