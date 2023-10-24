import { Skeleton } from "@mui/material";
import React from "react";

export default function MovieSceleton() {
  return (
    <div className="grid gap-1">
      <Skeleton variant="rounded" height={300} />
      <Skeleton variant="rounded" height={30} />
      <Skeleton variant="rounded" height={32} />
    </div>
  );
}
