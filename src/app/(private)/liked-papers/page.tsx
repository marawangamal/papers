import { getCollectionPapers } from "@/lib/actions/collections";
import React from "react";

export default async function LikePapersPage() {
  const collectionPapers = await getCollectionPapers();
  return (
    <div>
      {collectionPapers.map((paper) => (
        <div key={paper.id}>
          <h3>{paper.title}</h3>
          <p>{paper.abstract}</p>
        </div>
      ))}
    </div>
  );
}
