import React from "react";

export default function POAttachment({ value, onChange }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      onChange(null);
      return;
    }

    // ✅ PDF validation
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      e.target.value = "";
      return;
    }

    // ✅ Optional: size validation (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("PDF size must be less than 5 MB");
      e.target.value = "";
      return;
    }

    onChange(file);
  };

  return (
    <div className="col-md-4">
      <label className="fw-semibold">Attach PO (PDF)</label>
      <input
        type="file"
        className="form-control form-control-lg"
        accept="application/pdf"
        onChange={handleFileChange}
      />
    </div>
  );
}
