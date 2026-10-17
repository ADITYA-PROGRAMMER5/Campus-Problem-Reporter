function AdminDashboard({ user, onLogout }) {
  return (
    <main>
      <h1>Admin Dashboard</h1>

      <p>Welcome, {user.name}!</p>
      <p>Role: {user.role}</p>

      <button onClick={onLogout}>Logout</button>
    </main>
  );
}

export default AdminDashboard;