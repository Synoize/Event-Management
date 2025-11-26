import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

export const getRazorpay = () => {
  if (!razorpayInstance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id) {
      throw new Error('RAZORPAY_KEY_ID is not set in environment variables');
    }

    razorpayInstance = new Razorpay({
      key_id,
      key_secret: key_secret || '',
    });
  }
  return razorpayInstance;
};

