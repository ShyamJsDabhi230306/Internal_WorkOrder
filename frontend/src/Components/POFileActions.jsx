import { getPoPdf } from "../API/workOrderApi";
import { getFileNameFromPath } from "../utils/fileUtils";

export default function POFileActions({ filePath }) {
  if (!filePath) return <span className="text-muted">—</span>;

  const fileName = getFileNameFromPath(filePath);

  const handleView = async () => {
    try {
      const blob = await getPoPdf(fileName);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Failed to open PDF");
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await getPoPdf(fileName);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
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

      {/* <button
        className="btn btn-sm btn-outline-success"
        onClick={handleDownload}
      >
        Download
      </button> */}
    </div>
  );
}
