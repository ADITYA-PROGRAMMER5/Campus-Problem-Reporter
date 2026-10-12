import { useState } from "react";
import ReportForm from "./ReportForm";
import ReportList from "./ReportList";

function Dashboard({ user, onLogout }) {
  // Changing this value tells ReportList to fetch reports again
  const [refreshKey, setRefreshKey] = useState(0);

  function handleReportCreated() {
    setRefreshKey((previousKey) => previousKey + 1);
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Campus Problem Reporter</h1>
          <p>Welcome, {user.name}!</p>
        </div>

        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <ReportForm
        userId={user.id}
        onReportCreated={handleReportCreated}
      />

      <ReportList refreshKey={refreshKey} />
    </main>
  );
}

export default Dashboard;