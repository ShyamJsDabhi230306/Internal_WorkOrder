export default function Forbidden403() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 style={{ fontSize: "80px", fontWeight: "bold" }}>403</h1>
      <h3>Access Denied</h3>
      <p>You don’t have permission to view this page.</p>
      <a href="/"
         className="btn btn-primary mt-3">
        Go Back
      </a>
    </div>
  );
}
