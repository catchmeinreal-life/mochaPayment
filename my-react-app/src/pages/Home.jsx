
export default function Home({ onLogout, isAuthenticated }) {
  return (
    <div>
      <h1>Home Page</h1>
      {isAuthenticated ? (
        <div>
          <p>Welcome back!</p>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <p>Please log in to access your dashboard.</p>
      )}
    </div>
  );
}