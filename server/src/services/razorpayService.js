const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../config/logger');

class RazorpayService {
  constructor() {
    this.instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  async createOrder(amount, receipt, notes = {}) {
    try {
      const options = {
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: receipt,
        payment_capture: 1,
        notes: {
          ...notes,
          receipt
        }
      };

      const order = await this.instance.orders.create(options);
      logger.info(`Razorpay order created: ${order.id}`);
      
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      };
    } catch (error) {
      logger.error('Razorpay order creation failed:', error);
      throw new Error(`Order creation failed: ${error.message}`);
    }
  }

  verifyPayment(orderId, paymentId, signature) {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    return expectedSignature === signature;
  }

  async getPayment(paymentId) {
    try {
      const payment = await this.instance.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      logger.error('Failed to fetch payment:', error);
      throw error;
    }
  }

  async refundPayment(paymentId, amount = null) {
    try {
      const options = {};
      if (amount) {
        options.amount = Math.round(amount * 100);
      }
      
      const refund = await this.instance.payments.refund(paymentId, options);
      logger.info(`Refund initiated: ${refund.id}`);
      return refund;
    } catch (error) {
      logger.error('Refund failed:', error);
      throw error;
    }
  }
}

module.exports = new RazorpayService();