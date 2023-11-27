import { Skeleton } from "@mui/material";

export default function MovieSkeleton() {
  return (
    <div className="rounded bg-[var(--black-2)] p-2">
      <div className="grid gap-2 cursor-pointer">
        <Skeleton className="aspect-[2/3] !h-auto w-full" variant="rounded" />
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
