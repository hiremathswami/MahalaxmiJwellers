'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/data/products';
import { supabase } from '@/lib/supabase';

type Step = 1 | 2 | 3;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const { items, getSubtotal, getShipping, getGST, getTotal, clearCart } = useCartStore();
  const { user, profile, loading: authLoading, initialize } = useAuthStore();

  const [placingOrder, setPlacingOrder] = useState(false);

  // Ensure auth store is initialized (handles page reload)
  useEffect(() => {
    initialize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 1: Address
  const [address, setAddress] = useState({
    fullName: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  });

  // Step 2: Shipping
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Load user details and default address if available
  useEffect(() => {
    if (user) {
      const metadataAddresses = user.user_metadata?.addresses || [];
      const defaultAddr = metadataAddresses.find((addr: any) => addr.isDefault) || metadataAddresses[0];

      if (defaultAddr) {
        setAddress({
          fullName: defaultAddr.fullName || profile?.name || '',
          email: user.email || '',
          phone: defaultAddr.phone || profile?.phone || '',
          line1: defaultAddr.line1 || '',
          line2: defaultAddr.line2 || '',
          city: defaultAddr.city || '',
          state: defaultAddr.state || '',
          pincode: defaultAddr.pincode || '',
        });
      } else {
        setAddress((prev) => ({
          ...prev,
          fullName: profile?.name || '',
          email: user.email || '',
          phone: profile?.phone || '',
        }));
      }
    }
  }, [user, profile]);

  const saveCheckoutAddress = async () => {
    if (!user) return;
    const currentAddresses = user.user_metadata?.addresses || [];
    
    // Check if this address already exists in the saved list (ignoring IDs)
    const exists = currentAddresses.some((addr: any) => 
      addr.fullName.trim().toLowerCase() === address.fullName.trim().toLowerCase() &&
      addr.line1.trim().toLowerCase() === address.line1.trim().toLowerCase() &&
      addr.city.trim().toLowerCase() === address.city.trim().toLowerCase() &&
      addr.state.trim().toLowerCase() === address.state.trim().toLowerCase() &&
      addr.pincode.trim().toLowerCase() === address.pincode.trim().toLowerCase()
    );

    if (!exists) {
      const newAddr = {
        id: Date.now().toString(),
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: currentAddresses.length === 0
      };
      
      const updated = [...currentAddresses, newAddr];
      if (typeof window !== 'undefined') {
        localStorage.setItem(`mj_addresses_${user.id}`, JSON.stringify(updated));
      }
      
      await supabase.auth.updateUser({ data: { addresses: updated } });
    }
  };

  const steps = [
    { num: 1, label: 'Address' },
    { num: 2, label: 'Shipping' },
    { num: 3, label: 'Payment' },
  ];

  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    return (
      address.fullName.trim() !== '' &&
      address.email.trim() !== '' &&
      address.phone.trim() !== '' &&
      address.line1.trim() !== '' &&
      address.city.trim() !== '' &&
      address.state.trim() !== '' &&
      address.pincode.trim() !== ''
    );
  };

  const handlePlaceOrder = async () => {
    if (!user) return;
    setPlacingOrder(true);
    try {
      const totalAmount = getTotal();

      // If Cash on Delivery is chosen, skip Razorpay flow entirely
      if (paymentMethod === 'cod') {
        const placeRes = await fetch('/api/orders/place', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderData: {
              user_id: user.id,
              customer_name: address.fullName,
              customer_email: address.email,
              customer_phone: address.phone,
              items: items.map(item => ({
                product_id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.images?.[0] || null,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
              })),
              total_amount: totalAmount,
              address_line1: address.line1 + (address.line2 ? `, ${address.line2}` : ''),
              address_city: address.city,
              address_state: address.state,
              address_pincode: address.pincode,
              notes: `Shipping: ${shippingMethod} | Payment: COD (Cash on Delivery)`,
            }
          })
        });

        const placeJson = await placeRes.json();
        if (!placeJson.success) throw new Error(placeJson.error || 'Failed to place COD order');

        await saveCheckoutAddress();
        clearCart();
        router.push(`/checkout/success?orderId=${placeJson.order.id}`);
        return;
      }

      // Otherwise, proceed with Razorpay payment flow
      const totalPaise = Math.round(totalAmount * 100);

      // 1. Create Razorpay Order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPaise }),
      });
      const orderJson = await orderRes.json();
      if (!orderJson.success) throw new Error(orderJson.error || 'Failed to initiate payment');

      // 2. Open Razorpay checkout modal
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: razorpayKey,
          amount: orderJson.order.amount,
          currency: orderJson.order.currency,
          order_id: orderJson.order.id,
          name: 'Mahalaxmi Jewellers',
          description: 'Jewellery Purchase',
          prefill: {
            name: address.fullName,
            email: address.email,
            contact: address.phone,
          },
          handler: async (response: any) => {
            try {
              // 3. Verify payment & save order
              const verifyRes = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData: {
                    user_id: user.id,
                    customer_name: address.fullName,
                    customer_email: address.email,
                    customer_phone: address.phone,
                    items: items.map(item => ({
                      product_id: item.product.id,
                      name: item.product.name,
                      price: item.product.price,
                      image: item.product.images?.[0] || null,
                      quantity: item.quantity,
                      selectedSize: item.selectedSize,
                    })),
                    total_amount: totalAmount,
                    address_line1: address.line1 + (address.line2 ? `, ${address.line2}` : ''),
                    address_city: address.city,
                    address_state: address.state,
                    address_pincode: address.pincode,
                    notes: `Shipping: ${shippingMethod} | Payment: ${paymentMethod}`,
                  },
                }),
              });
              const verifyJson = await verifyRes.json();
              if (!verifyJson.success) throw new Error(verifyJson.error || 'Payment verification failed');
              await saveCheckoutAddress();
              clearCart();
              router.push(`/checkout/success?orderId=${verifyJson.order.id}`);
              resolve();
            } catch (err: any) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled'));
            },
          },
        });
        rzp.open();
      });
    } catch (err: any) {
      if (err.message !== 'Payment cancelled') {
        alert(err.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  // ── RENDER AUTH REQUIRED SCREEN ──
  if (authLoading) {
    return (
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center">
        <p className="text-warm-gray">Verifying checkout session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white min-h-screen pt-28 pb-20 flex items-center justify-center px-6">
        <div className="max-w-md w-full border border-gray-200 bg-champagne p-8 text-center rounded-2xl">
          <svg className="mx-auto text-silver/40 mb-6" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <h1 className="font-cormorant text-3xl text-charcoal mb-3">Sign In Required</h1>
          <p className="text-warm-gray text-sm mb-8">
            To ensure a secure checkout experience, please sign in or create an account.
          </p>
          <Link href="/auth?redirect=/checkout" className="btn-gold w-full text-center block">
            Sign In & Continue
          </Link>
          <Link href="/cart" className="block text-center text-warm-gray text-sm mt-4 hover:text-charcoal transition-colors">
            Return to Bag
          </Link>
        </div>
      </div>
    );
  }

  // ── RENDER EMPTY BAG WARNING ──
  if (items.length === 0 && !placingOrder) {
    return (
      <div className="bg-white min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-cormorant text-3xl text-charcoal mb-4">No Items to Checkout</h1>
          <Link href="/shop" className="btn-gold">Go to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <h1 className="font-cormorant text-4xl lg:text-5xl text-charcoal mb-12 text-center font-bold">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-16 max-w-lg mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-sm transition-all duration-300 ${
                    step >= s.num
                      ? 'bg-charcoal text-white font-medium'
                      : 'border border-gray-200 text-warm-gray'
                  }`}
                >
                  {s.num}
                </div>
                <span
                  className={`text-xs uppercase tracking-[0.1em] hidden sm:block ${
                    step >= s.num ? 'text-charcoal font-medium' : 'text-warm-gray'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-px ${step > s.num ? 'bg-charcoal' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form Area — 60% */}
          <div className="lg:col-span-3">
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="font-cormorant text-2xl text-charcoal mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-warm-gray text-xs uppercase tracking-[0.1em] mb-2 block">Full Name</label>
                    <input type="text" value={address.fullName} onChange={(e) => handleAddressChange('fullName', e.target.value)} className="input-light" id="checkout-name" />
                  </div>
                  <div>
                    <label className="text-warm-gray text-xs uppercase tracking-[0.1em] mb-2 block">Email</label>
                    <input type="email" value={address.email} onChange={(e) => handleAddressChange('email', e.target.value)} className="input-light" id="checkout-email" />
                  </div>
                  <div>
                    <label className="text-warm-gray text-xs uppercase tracking-[0.1em] mb-2 block">Phone</label>
                    <input type="tel" value={address.phone} onChange={(e) => handleAddressChange('phone', e.target.value)} className="input-light" id="checkout-phone" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-warm-gray text-xs uppercase tracking-[0.1em] mb-2 block">Address Line 1</label>
                    <input type="text" value={address.line1} onChange={(e) => handleAddressChange('line1', e.target.value)} className="input-light" id="checkout-line1" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-warm-gray text-xs uppercase tracking-[0.1em] mb-2 block">Address Line 2</label>
                    <input type="text" value={address.line2} onChange={(e) => handleAddressChange('line2', e.target.value)} className="input-light" id="checkout-line2" />
                  </div>
                  <div>
                    <label className="text-warm-gray text-xs uppercase tracking-[0.1em] mb-2 block">City</label>
                    <input type="text" value={address.city} onChange={(e) => handleAddressChange('city', e.target.value)} className="input-light" id="checkout-city" />
                  </div>
                  <div>
                    <label className="text-warm-gray text-xs uppercase tracking-[0.1em] mb-2 block">State</label>
                    <input type="text" value={address.state} onChange={(e) => handleAddressChange('state', e.target.value)} className="input-light" id="checkout-state" />
                  </div>
                  <div>
                    <label className="text-warm-gray text-xs uppercase tracking-[0.1em] mb-2 block">Pincode</label>
                    <input type="text" value={address.pincode} onChange={(e) => handleAddressChange('pincode', e.target.value)} className="input-light" id="checkout-pincode" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h2 className="font-cormorant text-2xl text-charcoal mb-6">Shipping Method</h2>
                {[
                  { id: 'standard', label: 'Standard Delivery', time: '5-7 business days', price: 'FREE' },
                  { id: 'express', label: 'Express Delivery', time: '2-3 business days', price: '₹299' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-6 border cursor-pointer transition-all duration-300 rounded-xl ${
                      shippingMethod === method.id
                        ? 'border-charcoal bg-champagne'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        shippingMethod === method.id ? 'border-charcoal' : 'border-gray-300'
                      }`}>
                        {shippingMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-charcoal" />}
                      </div>
                      <div>
                        <p className="text-charcoal font-medium">{method.label}</p>
                        <p className="text-warm-gray text-sm">{method.time}</p>
                      </div>
                    </div>
                    <span className="font-medium text-charcoal">
                      {method.price}
                    </span>
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={shippingMethod === method.id}
                      onChange={() => setShippingMethod(method.id)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h2 className="font-cormorant text-2xl text-charcoal mb-6">Payment Method</h2>
                {[
                  { id: 'upi', label: 'UPI', desc: 'Pay using Google Pay, PhonePe, or any UPI app' },
                  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay' },
                  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks supported' },
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-6 border cursor-pointer transition-all duration-300 rounded-xl ${
                      paymentMethod === method.id
                        ? 'border-charcoal bg-champagne'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === method.id ? 'border-charcoal' : 'border-gray-300'
                    }`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-charcoal" />}
                    </div>
                    <div>
                      <p className="text-charcoal font-medium">{method.label}</p>
                      <p className="text-warm-gray text-sm">{method.desc}</p>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="sr-only"
                    />
                  </label>
                ))}

                {/* UPI sub-field */}
                {paymentMethod === 'upi' && (
                  <div className="mt-4 ml-9">
                    <label className="text-warm-gray text-xs uppercase tracking-[0.15em] mb-2 block">UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="input-light max-w-sm"
                      id="upi-id"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                )}

                {/* Card sub-fields */}
                {paymentMethod === 'card' && (
                  <div className="mt-4 ml-9 space-y-4">
                    <div>
                      <label className="text-warm-gray text-xs uppercase tracking-[0.15em] mb-2 block">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="input-light max-w-sm"
                        id="card-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                      <div>
                        <label className="text-warm-gray text-xs uppercase tracking-[0.15em] mb-2 block">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="input-light"
                          id="card-expiry"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-warm-gray text-xs uppercase tracking-[0.15em] mb-2 block">CVV</label>
                        <input
                          type="password"
                          placeholder="123"
                          className="input-light"
                          id="card-cvv"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              {step > 1 ? (
                <button onClick={() => setStep((step - 1) as Step)} className="btn-ghost-gold" id="checkout-back" disabled={placingOrder}>
                  Back
                </button>
              ) : (
                <Link href="/cart" className="btn-ghost-gold">Back to Bag</Link>
              )}

              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1 && !validateAddress()) {
                      alert('Please fill in all address fields.');
                      return;
                    }
                    setStep((step + 1) as Step);
                  }}
                  className="btn-gold"
                  id="checkout-continue"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="btn-gold"
                  id="checkout-place-order"
                  disabled={placingOrder}
                >
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar — 40% */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 bg-[#F8F7F5] p-8 lg:sticky lg:top-28 rounded-2xl">
              <h2 className="font-cormorant text-2xl text-charcoal mb-6">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-light-gray flex-shrink-0 flex items-center justify-center relative overflow-hidden rounded-md border border-gray-200">
                      {item.product.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-charcoal/20 text-[10px] font-bold">MJ</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-charcoal text-sm truncate">{item.product.name}</p>
                      <p className="text-warm-gray text-xs">Qty: {item.quantity} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}</p>
                    </div>
                    <span className="text-charcoal text-sm flex-shrink-0 font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-200 my-6" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Subtotal</span>
                  <span className="text-charcoal">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Shipping</span>
                  <span className="text-charcoal">
                    {getShipping() === 0 ? <span className="text-silver-dark font-medium">FREE</span> : formatPrice(getShipping())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">GST (3%)</span>
                  <span className="text-charcoal">{formatPrice(getGST())}</span>
                </div>
                <div className="h-px bg-gray-200 my-4" />
                <div className="flex justify-between pt-2">
                  <span className="text-charcoal font-medium">Total</span>
                  <span className="text-charcoal text-xl font-cormorant font-bold">{formatPrice(getTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
