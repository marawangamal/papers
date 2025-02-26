import { getCollectionPapers } from "@/lib/actions/collections";
import { Stack } from "@mantine/core";
import React from "react";

export default async function LikePapersPage() {
  const collectionPapers = await getCollectionPapers();
  return (
    <Stack h="100%" w="100%" style={{ overflowY: "auto" }}>
      {collectionPapers.map((paper) => (
        <div key={paper.id}>
          <h3>{paper.title}</h3>
          <p>{paper.abstract}</p>
        </div>
      ))}
    </Stack>
  );
}
