import { API_URL } from "../config/constant";

export default function DispatchFileActions({ filePath }) {
  if (!filePath) return <span className="text-muted">—</span>;

  const handleView = () => {
    try {
      // Remove '/api/' from the end of API_URL to get the base server URL
      const baseUrl = API_URL.replace(/\/api\/?$/, "/");
      const fullUrl = `${baseUrl}${filePath}`;
      window.open(fullUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to open file");
    }
  };

  return (
    <div className="d-flex gap-2 justify-content-center">
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={handleView}
      >
        <i className="bi bi-eye"></i>
      </button>
    </div>
  );
}