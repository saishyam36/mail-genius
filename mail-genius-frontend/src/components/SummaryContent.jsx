import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

 const SummaryContent = ({summary, isSummarizing}) => {
  let content;
  if (isSummarizing) {
    content = (
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[280px]" />
        <Skeleton className="h-4 w-[220px]" />
      </div>
    );
  } else if (summary) {
    content = (
      <div className="break-words" dangerouslySetInnerHTML={{ __html: summary }} />
    );
  } else {
    content = <p>No summary available</p>;
  }

  return (
    <div
      className="w-full max-h-[250px] overflow-y-auto p-4 bg-gray-50 rounded-md border text-sm text-gray-700 space-y-3 break-words">
      {content}
    </div>
  );
};

export default SummaryContent;
