import React from "react";

 const SummaryContent = ({summary}) => {
  return (
    <div
      className="max-h-[250px] overflow-y-auto p-4 bg-gray-50 rounded-md border text-sm text-gray-700 space-y-3">
      {summary ? (
        <p>{summary}</p>
      ) : (
        <p>No summary available</p>
      )}
    </div>
  );
};

export default SummaryContent;