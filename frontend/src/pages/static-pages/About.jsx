import React from 'react'

function About() {
    return (
        <div>

            {/* <!-- About Us Section --> */}
            <section class="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">About Us</h2>
                <p class="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Welcome to HouseRentalPro, your reliable partner in property management. We are committed to providing efficient, effective, and hassle-free rental management solutions to landlords and tenants alike.</p>

                <div class="space-y-8">
                    {/* <!-- Mission Statement --> */}
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h3>
                        <p class="text-gray-600 dark:text-gray-400">Our mission is to simplify the rental process through innovative technology and unparalleled customer service. We strive to create a seamless experience for both property owners and renters, ensuring satisfaction and peace of mind for all parties involved.</p>
                    </div>

                    {/* <!-- Our Team --> */}
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Team</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">Our team is composed of experienced professionals dedicated to making property management straightforward and efficient. With a diverse background in real estate, technology, and customer service, we are equipped to handle all aspects of rental management.</p>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div class="text-center">
                                <img src="/images/ceo.jpeg" alt="Team Member 1" class="w-32 h-32 mx-auto rounded-full mb-4" />
                                <h4 class="text-xl font-bold text-gray-900 dark:text-white">John Doe</h4>
                                <p class="text-gray-500 dark:text-gray-400">CEO</p>
                            </div>
                            <div class="text-center">
                                <img src="images/cto.jpeg" alt="Team Member 2" class="w-32 h-32 mx-auto rounded-full mb-4" />
                                <h4 class="text-xl font-bold text-gray-900 dark:text-white">Jane Smith</h4>
                                <p class="text-gray-500 dark:text-gray-400">CTO</p>
                            </div>
                            <div class="text-center">
                                <img src="images/manager.jpeg" alt="Team Member 3" class="w-32 h-32 mx-auto rounded-full mb-4" />
                                <h4 class="text-xl font-bold text-gray-900 dark:text-white">Emily Johnson</h4>
                                <p class="text-gray-500 dark:text-gray-400">COO</p>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Our Values --> */}
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Values</h3>
                        <ul class="list-disc list-inside text-gray-600 dark:text-gray-400">
                            <li class="mb-2">Integrity: We uphold the highest standards of integrity in all of our actions.</li>
                            <li class="mb-2">Customer Commitment: We develop relationships that make a positive difference in our customers' lives.</li>
                            <li class="mb-2">Quality: We provide outstanding products and unsurpassed service that together deliver premium value to our customers.</li>
                            <li class="mb-2">Teamwork: We work together, across boundaries, to meet the needs of our customers and to help our Company win.</li>
                        </ul>
                    </div>
                </div>
            </section>


        </div>
    )
}

export default About