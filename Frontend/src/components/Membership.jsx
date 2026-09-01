import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { useAuth } from '../conetxt/AuthProvider';
import { useNavigate } from 'react-router-dom';
import plans from '../../public/plans.json';

const Membership = () => {
  const [authUser] = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: true } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: true } },
    ],
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getPlanColor = (name) => {
    switch (name) {
      case 'Bronze': return 'from-yellow-600 to-yellow-800';
      case 'Silver': return 'from-gray-400 to-gray-600';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-200 to-gray-400';
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan || !authUser) {
      setMessage('No plan selected or user not logged in');
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      const amount = selectedPlan.price;

  const response = await fetch(`${API_BASE_URL}/v1/createorder`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount }),
});


      const data = await response.json();

      if (!data.success) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: 'rzp_test_ec1zNt5mT3IjPP',
        amount: data.amount,
        currency: data.currency,
        name: 'Khanakhazana',
        description: `Payment for ${selectedPlan.name} Plan`,
        order_id: data.order_id,
        handler: async function (response) {
        const verifyResponse = await fetch(`${API_BASE_URL}/v1/verifypayment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        userId: authUser._id,
        plan: selectedPlan.name.toLowerCase(), // match plan in backend {basic, silver, gold}
  }),
});

      
          const verifyData = await verifyResponse.json();
      
          if (verifyData.success) {
            alert(`Payment Verified! ✅ Plan Activated: ${selectedPlan.name}`);
            localStorage.setItem("Users", JSON.stringify(verifyData.user));
            navigate('/profile');
          } else {
            alert("Payment verification Successfully");
          }
        },
        prefill: {
          name: authUser.name || 'Test User',
          email: authUser.email || 'test@example.com',
          contact: '9000090000',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      setMessage(error.message || 'Payment failed! Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-12 min-h-screen flex flex-col justify-center">
      <h2 className="text-center text-4xl font-extrabold mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Choose Your Membership
      </h2>

      <Slider {...settings}>
        {plans.map((plan, index) => (
          <div
            key={index}
            className="px-2 focus:outline-none"
            onClick={() => setSelectedPlan(plan)}
          >
            <div className={`bg-gradient-to-br ${getPlanColor(plan.name)} rounded-xl shadow-xl p-1 hover:shadow-2xl transition-all duration-300 ${
              selectedPlan?.name === plan.name ? 'ring-4 ring-blue-400' : ''
            }`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center h-full">
                <img 
                  src={plan.logo} 
                  alt={`${plan.name} logo`} 
                  className="w-32 h-32 mx-auto mb-6 object-contain animate-float"
                />
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 min-h-[80px]">
                  {plan.description}
                </p>
                <div className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  ₹{plan.price}
                  <span className="text-lg text-gray-500">/month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className={`bg-gradient-to-br ${getPlanColor(selectedPlan.name)} rounded-2xl shadow-2xl p-8 w-full max-w-lg relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                {selectedPlan.name} Plan
              </h2>
              
              <div className="bg-white/90 backdrop-blur rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Plan Benefits:</h3>
                <ul className="space-y-3">
                  {selectedPlan.benefits.map((benefit, idx) => (
                    <li 
                      key={idx}
                      className="flex items-center text-gray-700"
                    >
                      <svg 
                        className="w-5 h-5 text-green-600 mr-2 flex-shrink-0"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <button
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-lg
                    ${
                      isProcessing || !authUser 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'hover:scale-105 transition-transform hover:shadow-lg'
                    }`
                  }
                  onClick={handlePayment}
                  disabled={isProcessing || !authUser}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'PAY NOW'
                  )}
                </button>
                
                {!authUser && (
                  <p className="text-red-100 mt-4 font-medium">
                    Please log in to proceed with payment
                  </p>
                )}
              </div>

              <button
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                onClick={() => setSelectedPlan(null)}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership;