import { Skeleton } from "@mui/material";

export default function MovieSkeleton() {
  return (
    <div className="card">
      <div className="grid gap-2 cursor-pointer h-fit">
        <Skeleton variant="rounded" height={300} />
        <div className="flex justify-between gap-2">
          <Skeleton variant="rounded" height={55} width={150} />
          <div className="flex gap-1">
            <Skeleton variant="rounded" height={27} width={50} />
          </div>
        </div>
      </div>
    </div>
  );
}
