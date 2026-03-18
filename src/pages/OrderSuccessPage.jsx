import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

export function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = new URLSearchParams(location.search).get('orderId');

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getOne(orderId);
      setOrder(response.data || response); // Handle varying response structures
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. We have received your order.
          </p>
        </div>

        {/* Dynamic Payment Instructions */}
        {order.paymentMethod === 'bml' && (
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Manual Bank Transfer Instructions</h3>
                <p className="text-blue-800 mb-4">Please transfer the total amount to the following BML account and send the receipt to our WhatsApp.</p>
                <div className="bg-white p-4 rounded border border-blue-100 font-mono text-sm space-y-2">
                    <p><span className="font-semibold">Bank:</span> Bank of Maldives (BML)</p>
                    <p><span className="font-semibold">Account Name:</span> Abaya Clothing</p>
                    <p><span className="font-semibold">Account Number:</span> 7730 1234 5678 901</p>
                    <p><span className="font-semibold">Reference:</span> {order.orderNumber || order._id}</p>
                </div>
                <a href={`https://wa.me/9607771234?text=Hi, I have transferred MVR ${order.total?.toFixed(2) || order.totalPrice?.toFixed(2)} for order ${order.orderNumber || order._id}.`} target="_blank" rel="noreferrer" className="inline-block mt-4 bg-green-500 text-white px-6 py-2 rounded font-semibold hover:bg-green-600 transition">
                    Send Receipt via WhatsApp
                </a>
            </div>
        )}

        {order.paymentMethod === 'card' && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold text-green-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Payment Successful
                </h3>
                <p className="text-green-800">Your credit/debit card has been successfully charged. (Demo mode: No real funds were deducted)</p>
            </div>
        )}

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-sm text-gray-600">Order Number</h2>
            <p className="text-xl font-mono font-semibold">{order.orderNumber || order._id}</p>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Shipping To
            </h3>
            <div className="ml-7 text-gray-700">
              <p className="font-semibold">{order.shippingAddress?.fullName || order.shippingAddress?.address || ""}</p>
              <p>{order.shippingAddress?.addressLine1 || order.shippingAddress?.address || ""}</p>
              {order.shippingAddress?.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state || ""} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country || "Maldives"}</p>
              <p className="mt-2 text-sm text-gray-600">
                Phone: {order.shippingAddress?.phone || order.shippingAddress?.phoneNo || ""}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.size && `Size: ${item.size}`}
                        {item.color && ` | Color: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.qty || item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">MVR {item.price * (item.qty || item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>MVR {order.subtotal?.toFixed(2) || order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>MVR {order.shippingCost?.toFixed(2) || order.shippingPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>MVR {order.tax?.toFixed(2) || order.taxPrice?.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-MVR {order.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total</span>
                <span>MVR {order.total?.toFixed(2) || order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-semibold">{order.paymentMethod}</p>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className="text-orange-600">{order.paymentStatus || (order.isPaid ? 'Paid' : 'Pending')}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 flex-wrap">
          <Link
            to="/profile"
            className="flex-1 bg-black text-white py-3 px-6 rounded-lg text-center hover:bg-gray-800 transition"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="flex-1 bg-white text-black border-2 border-black py-3 px-6 rounded-lg text-center hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>We&apos;ve sent a confirmation email to your registered email address.</p>
          <p className="mt-2">
            Questions? <Link to="/contact" className="text-blue-600 hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
