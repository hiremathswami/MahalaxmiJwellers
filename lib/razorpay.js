import Razorpay from 'razorpay';

let instance = null;

export const razorpay = new Proxy({}, {
  get(target, prop) {
    if (!instance) {
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_SECRET;

      if (!keyId || !keySecret) {
        throw new Error('Razorpay SDK: RAZORPAY_KEY_ID or RAZORPAY_SECRET is missing.');
      }

      instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
    return Reflect.get(instance, prop);
  }
});
