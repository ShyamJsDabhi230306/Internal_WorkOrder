import { getDispatchPdf } from "../API/workOrderApi";
import { getFileNameFromPath } from "../utils/fileUtils";

export default function DispatchFileActions({ filePath }) {

  if (!filePath) return <span className="text-muted">—</span>;

  const fileName = getFileNameFromPath(filePath);

  const handleView = async () => {
    try {

      const blob = await getDispatchPdf(fileName);

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

    } catch (err) {
      console.error(err);
      alert("Failed to open PDF");
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