import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_SECRET;

if (!keyId || !keySecret) {
  console.warn('Razorpay SDK: RAZORPAY_KEY_ID or RAZORPAY_SECRET is missing.');
}

export const razorpay = new Razorpay({
  key_id: keyId || '',
  key_secret: keySecret || '',
});
