import React from "react";

export default function Loading() {
  return (
    <div className='max-w-[1000px] mx-auto text-sm'>
      <div className='animate-pulse'>
        <h1 className='text-4xl font-bold text-gray-900 mr-4 text-center'>
          Random String Generator
        </h1>

        <div className='animate-pulse flex justify-center items-center mt-6'>
          <div className="mr-2 h-2 bg-slate-300 rounded w-[40px]"></div>
          {[...new Array(4)].map((_, i) => (
            <div className="mr-2 h-[43px] w-[43px] bg-slate-300 rounded-md" key={`loading-byte-option-${i}`}></div>
          ))}
          <div className="mr-2 h-[43px] w-[84px] bg-slate-300 rounded-md"></div>
        </div>
      </div>
    </div>
  )
}