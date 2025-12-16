import React from 'react'

const Available = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-8 md:px-16 md:mt-8 px-4 w-full'>
     {/* Desktop Layout - Horizontal */}
     <div className='hidden md:flex items-center justify-center gap-6 w-full'>
        <div className='flex-grow h-[0.2rem] bg-gray-300 max-w-[350px]'></div>
        <div className='flex items-center gap-4 whitespace-nowrap'> 
           <h2 className='text-3xl font-semibold'>Also Available On</h2>
           
          <div className='bg-white shadow-lg rounded-xl p-3'>
           <a target='_blank' href="https://www.amazon.in/Kitchen-Dining-Summit-Home/s?rh=n%3A5925789031%2Cp_89%3ASummit" >
           <img src="/asset/images/Available/amazon.png" alt="" className='w-16 h-16 object-contain' />
           </a>
           </div> 
          <div className='bg-white shadow-lg rounded-xl p-3'>
           <a target='_blank' href="https://www.flipkart.com/kitchen-cookware-serveware/summit~brand/pr?sid=all%2Cupp" >
           <img src="/asset/images/Available/Flipkart.png" alt="" className='w-16 h-16 object-contain' />
           </a>
           </div> 
          <div className='bg-white shadow-lg rounded-xl p-3'>
           <a target='_blank' href="https://www.myntra.com/summit-pressure-cooker" >
           <img src="/asset/images/Available/Myntra.png" alt="" className='w-16 h-16 object-contain' />
           </a>
           </div> 
        </div>
        <div className='flex-grow h-[0.2rem] bg-gray-300 max-w-[350px]'></div>
     </div>

     {/* Mobile Layout - Vertical */}
     <div className='md:hidden flex flex-col items-center gap-4 w-full'>
        <div className='flex items-center justify-center gap-4 w-full'>
          <div className='flex-grow h-[0.2rem] bg-gray-300 max-w-[120px]'></div>
          <h2 className='text-xl font-semibold text-center'>Also Available On</h2>
          <div className='flex-grow h-[0.2rem] bg-gray-300 max-w-[120px]'></div>
        </div>
        <div className='flex items-center justify-center gap-6'>
          <div className='bg-white shadow-lg rounded-xl p-2'>
           <a target='_blank' href="https://www.amazon.in/Kitchen-Dining-Summit-Home/s?rh=n%3A5925789031%2Cp_89%3ASummit" >
           <img src="/asset/images/Available/amazon.png" alt="" className='size-10 object-contain' />
           </a>
          </div> 
          <div className='bg-white shadow-lg rounded-xl p-2'>
           <a target='_blank' href="https://www.flipkart.com/kitchen-cookware-serveware/summit~brand/pr?sid=all%2Cupp" >
           <img src="/asset/images/Available/Flipkart.png" alt="" className='size-10 object-contain' />
           </a>
          </div> 
          <div className='bg-white shadow-lg rounded-xl p-2'>
           <a target='_blank' href="https://www.myntra.com/summit-pressure-cooker" >
           <img src="/asset/images/Available/Myntra.png" alt="" className='size-10 object-contain' />
           </a>
          </div> 
        </div>
     </div>
    </div>
  )
}

export default Available
