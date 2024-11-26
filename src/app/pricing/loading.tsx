import React from "react";

export default function Loading () {
  return (
    <div className='max-w-[1000px] mx-auto animate-pulse'>
      <div className='md:grid md:grid-cols-3 md:gap-6'>

        {[...new Array(2)].map((_, i) => (
          <div className='p-6 rounded-lg bg-white shadow flex-col mb-6 md:mb-0' key={`loading-plan-${i}`}>
            <div className="h-[32px] bg-slate-300 rounded w-[75px]"></div>
            <div className='flex items-end mt-3'>
              <div className="h-[38px] w-[36px] bg-slate-300 rounded mr-2"></div>
              <div className="h-[24px] w-[115px] bg-slate-300 rounded mr-2"></div>
            </div>

            <div className="h-2 bg-slate-300 rounded w-full mt-6"></div>
            <div className="h-2 bg-slate-300 rounded w-[150px] mt-3"></div>

            <div className='mt-6'>
              {[...new Array(4)].map((_, i) => (
                <div className='flex mt-2 items-center' key={`loading-${i}`}>
                  <div className='h-[15px] w-[15px] bg-slate-300 rounded-full mr-2'></div>
                  <div className="h-2 bg-slate-300 rounded w-[100px]"></div>
                </div>
              ))}
            </div>

            <div className="h-[50px] w-full bg-slate-300 rounded-md mt-6"></div>
          </div>
        ))}

      </div>
    </div>
  )
}