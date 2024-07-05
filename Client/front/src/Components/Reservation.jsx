import React from 'react'
import Navbar from './Navbar'

function Reservation() {
  return (
    <>
    <Navbar/>



<div className='space-y-6 relative top-20'>
    <div className='flex  justify-center gap-10'>
        <h1 className='font-semibold  text-lg '>Car Size:</h1>
        <div className='space-x-4'>
            <span className='bg-blue-100 hover:bg-blue-300 cursor-pointer py-2 px-5 rounded-full shadow-xl font-medium text-sm  '>Small</span>
            <span className='bg-blue-100 hover:bg-blue-300 cursor-pointer py-2 px-5 rounded-full shadow-xl font-medium text-sm  '>Medium</span>
            <span className='bg-blue-100 hover:bg-blue-300 cursor-pointer py-2 px-5 rounded-full shadow-xl font-medium text-sm  '>Large</span>

        </div>
    </div>


    <div className='flex  justify-center gap-10'>
        <h1 className='font-semibold  text-lg '>Wash Type:</h1>
        <div className='space-x-4'>
            <span className='bg-blue-100 hover:bg-blue-300 cursor-pointer py-2 px-5 rounded-full shadow-xl font-medium text-sm  '>Interior</span>
            <span className='bg-blue-100 hover:bg-blue-300 cursor-pointer py-2 px-5 rounded-full shadow-xl font-medium text-sm  '>Exterior</span>
            <span className='bg-blue-100 hover:bg-blue-300 cursor-pointer py-2 px-5 rounded-full shadow-xl font-medium text-sm  '>Interior - Exterior</span>

        </div>
    </div>
</div>





    <div class="flex flex-col relative top-36 w-screen">
  <div class="-m-1.5 overflow-x-auto">
    <div class="p-1.5 min-w-full inline-block align-middle">
      <div class="border rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
              <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Age</th>
              <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Address</th>
              <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">John Brown</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">45</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">New York No. 1 Lake Park</td>
              <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                <button type="button" class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
              </td>
            </tr>

            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Jim Green</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">27</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">London No. 1 Lake Park</td>
              <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                <button type="button" class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
              </td>
            </tr>

            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">Joe Black</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">31</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">Sidney No. 1 Lake Park</td>
              <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                <button type="button" class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>





    </>
  )
}

export default Reservation