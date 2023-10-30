import { Skeleton } from "@mui/material";

export default function PageSkeleton() {
  function getRandomWidth(): number {
    let rand = 50 + Math.random() * (400 + 1 - 50);
    return Math.floor(rand);
  }

  return (
    <div className="grid gap-12 w-full">
      <div className="w-full grid gap-4">
        <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-between sm:justify-start items-center">
          <Skeleton variant="rounded" width={350} height={45}></Skeleton>
          <Skeleton variant="rounded" width={280} height={45}></Skeleton>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={45}></Skeleton>
          <Skeleton variant="rounded" width={600} height={45}></Skeleton>
        </div>
      </div>
      <div className="grid md:flex gap-8 w-full">
        <div className="grid gap-4 md:max-w-[30%] min-w-[350px]">
          <Skeleton variant="rounded" className="w-full" height={500}></Skeleton>
          <Skeleton variant="rounded" className="w-full" height={170}></Skeleton>
        </div>
        <div className="w-full">
          <Skeleton variant="rounded" className="mb-4 w-[120px]" height={30}></Skeleton>
          <div className="grid gap-4">
            {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((el) => (
              <div className="flex gap-2 justify-between md:justify-normal text-sm">
                <Skeleton variant="rounded" className="md:w-[140px]" height={25}></Skeleton>
                <Skeleton variant="rounded" width={getRandomWidth()} height={25}></Skeleton>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Skeleton className="mb-4" variant="rounded" width={200} height={50}></Skeleton>
        <Skeleton variant="rounded" className="w-full" height={300}></Skeleton>
      </div>
    </div>
  );
}
