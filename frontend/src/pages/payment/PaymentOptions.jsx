import React, { useState } from 'react';
import { intilizePayment } from '../../api/payment';
// import { useUser } from '../../context/UserContext';
function PaymentOptions() {

    const [selectedGateway, setSelectedGateway] = useState(1);

    const handleGatewayChange = (event) => {
        setSelectedGateway(event.target.value);
    };
    const {user} = useUser()

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle the form submission logic
        console.log('Selected Payment Gateway ID:', selectedGateway);
    };

    const gateways = [
        { payment_gateway_id: 1, payment_gateway_logo: '/images/bank-transfer.jpg', display_name: 'Bank Transfer' },
        { payment_gateway_id: 2, payment_gateway_logo: '/images/chapa.png', display_name: 'Chapa' },
    ];
    const handleOption = async () => {
        console.log('hello faya');
        if (parseInt(selectedGateway) === 2) {  // Correct comparison logic
            const userId = user.id;
            console.log(userId,'here is user id')
            await intilizePayment(user);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg">
                <div className="bg-white shadow-lg rounded-lg">
                    <div className="p-6">
                        <h3 className="text-center text-2xl font-semibold text-gray-700 mb-4">Payment Method</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {gateways.map((gateway) => (
                                        <div className="w-full" key={gateway.payment_gateway_id}>
                                            <label className={`block border rounded-lg p-4 cursor-pointer ${selectedGateway === gateway.payment_gateway_id ? 'border-blue-500' : 'border-gray-200'}`}>
                                                <input
                                                    type="radio"
                                                    name="payment_gateway_id"
                                                    value={gateway.payment_gateway_id}
                                                    onChange={handleGatewayChange}
                                                    checked={selectedGateway == gateway.payment_gateway_id}
                                                />
                                                <div className="flex items-center space-x-3">
                                                    <span
                                                        className="block w-10 h-10 bg-cover bg-center rounded-full"
                                                        style={{ backgroundImage: `url(${gateway.payment_gateway_logo})` }}
                                                    ></span>
                                                    <div>
                                                        <div className="text-lg font-medium text-gray-800">{gateway.display_name}</div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-center">

                                <button type="submit" onClick={handleOption} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                                    Continue for Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default PaymentOptions;
