import { Divider, Skeleton } from "@mui/material";

export default function PageSkeleton() {
  function getRandomWidth(): number {
    let rand = 50 + Math.random() * (200 + 1 - 50);
    return Math.floor(rand);
  }

  return (
    <div className="grid gap-4 w-full">
      <div className="grid w-full lg:flex lg:justify-between">
        <div className="w-full md:w-fit">
          <div className="flex items-center mb-4 gap-4">
            <Skeleton variant="circular" width={40} height={40}></Skeleton>
            <Skeleton variant="rounded" className='w-full md:w-[400px]' height={45}></Skeleton>
          </div>
          <Skeleton variant="rounded" className='w-full md:w-[600px]' height={45}></Skeleton>
        </div>
        <div className="mt-4 lg:mt-0 ratings">
          <Skeleton variant="rounded" className='w-full md:w-[180px]' height={45}></Skeleton>
          <Skeleton variant="rounded" className='w-full md:w-[180px]' height={45}></Skeleton>
        </div>
      </div>
      <div className="grid gap-4 w-full">
        <div className="grid h-fit gap-4 w-full md:flex md:h-[500px]">
          <Skeleton variant="rounded" className="w-full !h-[500px] md:!h-full md:w-[40%]"></Skeleton>
          <Skeleton variant="rounded" width="100%" className="!h-[40vh] md:!h-full md:!h-full"></Skeleton>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Skeleton variant="rounded" width={76} height={32}></Skeleton>
          <Skeleton variant="rounded" width={76} height={32}></Skeleton>
          <Skeleton variant="rounded" width={76} height={32}></Skeleton>
          <Skeleton variant="rounded" width={76} height={32}></Skeleton>
          <Skeleton variant="rounded" width={76} height={32}></Skeleton>
        </div>
        <div className="w-full">
          <Divider className="!mt-0" />
          <Skeleton variant="rounded" width="100%" height={100}></Skeleton>
          <Divider />
          <div className="grid gap-4">
            {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((el, i) => (
              <div key={i} className="flex gap-2 justify-between md:justify-normal text-sm">
                <Skeleton variant="rounded" className='w-[100px] md:w-[200px]' height={20} />
                <Skeleton variant="rounded" width={getRandomWidth()} height={20} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr />
      <Skeleton variant="rounded" width="100%" height={115} />
      <hr />
      <Skeleton variant="rounded" width="100%" height={115} />
    </div>
  );
}
