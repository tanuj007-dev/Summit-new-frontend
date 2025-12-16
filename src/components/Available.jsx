import React from 'react'

const Available = () => {
  return (
    <div className='flex items-center justify-center gap-6 py-8 md:px-16 md:mt-8  px-4 w-full'>
     <div className='flex-grow h-[0.2rem] bg-gray-300 max-w-[350px]'></div>
     <div className='flex items-center gap-4 whitespace-nowrap '> 
        <h2 className='text-3xl font-semibold'>Also Available On</h2>
        
       <div className='bg-yellow shadow-lg'>
        <a target='_blank' href="https://www.amazon.in/Kitchen-Dining-Summit-Home/s?rh=n%3A5925789031%2Cp_89%3ASummit" >
        <img src="/asset/images/Available/amazon.png" alt="" className='md:w-16 w-10 h-10 object-contain' />
        </a>
        </div> 
       <div className='bg-yellow shadow-lg'>
        <a target='_blank' href="https://www.flipkart.com/kitchen-cookware-serveware/summit~brand/pr?sid=all%2Cupp" >
        <img src="/asset/images/Available/Flipkart.png" alt="" className='md:w-16 w-10 h-10 object-contain' />
        </a>
        </div> 
       <div className='bg-yellow shadow-lg'>
        <a target='_blank' href="https://www.myntra.com/summit-pressure-cooker" >
        <img src="/asset/images/Available/Myntra.png" alt="" className='md:w-16 w-10 h-10 object-contain' />
        </a>
        </div> 
     </div>
     <div className='flex-grow h-[0.2rem] bg-gray-300 max-w-[350px]'></div>

     {/* ----------------------------End---------------------------- */}
    </div>
  )
}

export default Available
