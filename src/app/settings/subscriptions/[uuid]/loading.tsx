import React from "react";

export default function Loading() {
  return (
    <div className='max-w-[1000px] mx-auto text-sm'>
      <div>
        <div className="animate-pulse flex items-center">
          <div className="mr-2 h-2 bg-slate-300 rounded w-[162px]"></div>
          <div className="mr-2 h-[34px] w-[95px] bg-slate-300 rounded-md"></div>
        </div>
      </div>

      <div className='mt-6 animate-pulse'>
        <div className='flex items-center mt-6'>
          <div className="mr-2 h-[46px] w-[100px] bg-slate-300 rounded-md"></div>
          <div className="mr-2 h-[46px] w-[160px] bg-slate-300 rounded-md"></div>
        </div>
      </div>

      <div className='mt-6'>
        <div className="mb-4 h-2 bg-slate-300 rounded w-[100px]"></div>

        {[...new Array(2)].map((_, index) => (
          <div className="shadow rounded-sm p-4 w-full bg-white mx-auto border-b-2" key={`loading-${index}`}>
            <div className="animate-pulse flex justify-between w-full">
              <div className='flex'>
                <div className="mr-2 h-2 bg-slate-300 rounded w-[100px]"></div>
              </div>
              <div className='flex'>
                <div className="mr-2 h-2 bg-slate-300 rounded w-[20px]"></div>
                <div className="h-2 bg-slate-300 rounded w-[50px]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}