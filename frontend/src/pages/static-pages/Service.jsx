import React from 'react'

function Service() {
  return (
    <div>
   
  {/* <!-- Hero Section --> */}
  <section class="bg-blue-600 text-white">
    <div class="container mx-auto px-4 py-20 text-center">
      <h2 class="text-4xl font-bold mb-4">Manage Your Rentals with Ease</h2>
      <p class="text-lg mb-8">Effortless property management for landlords and tenants</p>
      <a href="#features" class="bg-white text-blue-600 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-gray-200">Learn More</a>
    </div>
  </section>

  {/* <!-- Features Section --> */}
  <section id="features" class="py-20">
    <div class="container mx-auto px-4">
      <h3 class="text-3xl font-bold text-gray-800 text-center mb-12">Features</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="flex items-center justify-center h-16 w-16 bg-blue-600 text-white rounded-full mb-4">
            <i class="fas fa-home text-2xl"></i>
          </div>
          <h4 class="text-xl font-bold mb-2">Property Listings</h4>
          <p class="text-gray-600">Easily list and manage multiple properties with detailed information and images.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="flex items-center justify-center h-16 w-16 bg-blue-600 text-white rounded-full mb-4">
            <i class="fas fa-users text-2xl"></i>
          </div>
          <h4 class="text-xl font-bold mb-2">Tenant Management</h4>
          <p class="text-gray-600">Keep track of tenant information, rental agreements, and communication history.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="flex items-center justify-center h-16 w-16 bg-blue-600 text-white rounded-full mb-4">
            <i class="fas fa-wallet text-2xl"></i>
          </div>
          <h4 class="text-xl font-bold mb-2">Payment Tracking</h4>
          <p class="text-gray-600">Monitor rent payments, generate invoices, and manage finances effortlessly.</p>
        </div>
      </div>
    </div>
  </section>


    </div>
  )
}

export default Service