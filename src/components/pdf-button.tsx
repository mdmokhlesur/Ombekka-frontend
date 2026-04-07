"use client";
import toast from "react-hot-toast";

export default function PdfButton() {
  const handleGeneratePdf = () => {
    // window.print();
    //Toast.success?("PDF generated successfully");
  };
  const notify = () => toast.success("PDF Functionality Coming Soon...");
  return (
    <button
      onClick={notify}
      className="cursor-pointer text-white bg-[#0060A9] hover:bg-[#004d88] px-5 py-2.5 rounded font-semibold text-sm flex items-center gap-2 border-none transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      Generate PDF
    </button>
  );
}
