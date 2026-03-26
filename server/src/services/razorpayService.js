const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../config/logger');
const Appointment = require('../models/Appointment');
const NotificationService = require('./notificationService');

class RazorpayService {
  constructor() {
    this.instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  async createOrder(appointmentId, amount, currency = 'INR', notes = {}) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('customer')
        .populate('service.id');
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      const options = {
        amount: Math.round(amount * 100),
        currency,
        receipt: appointment._id.toString(),
        payment_capture: 1,
        notes: {
          appointmentId: appointment._id.toString(),
          customerName: appointment.customer.name,
          customerEmail: appointment.customer.email,
          ...notes
        }
      };

      const order = await this.instance.orders.create(options);
      
      logger.info(`Razorpay order created: ${order.id} for appointment ${appointmentId}`);
      
      // Update appointment with order ID
      appointment.payment.orderId = order.id;
      await appointment.save();

      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
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

  async handleWebhook(payload, signature) {
    let event;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    try {
      event = this.instance.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    } catch (err) {
      logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    logger.info(`Received Razorpay webhook event: ${event.type}`);

    switch (event.type) {
      case 'payment.captured':
        await this.handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'refund.created':
        await this.handleRefundCreated(event.payload.refund.entity);
        break;
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    return event;
  }

  async handlePaymentCaptured(payment) {
    try {
      const appointment = await Appointment.findOne({ 
        'payment.orderId': payment.order_id 
      }).populate('customer');

      if (!appointment) {
        logger.error(`Appointment not found for order: ${payment.order_id}`);
        return;
      }

      appointment.payment.status = 'paid';
      appointment.payment.transactionId = payment.id;
      appointment.payment.paidAt = new Date();
      appointment.payment.metadata = {
        ...appointment.payment.metadata,
        razorpayPayment: payment
      };
      
      if (appointment.status === 'pending') {
        appointment.status = 'confirmed';
      }

      await appointment.save();

      // Send confirmation notifications
      await NotificationService.sendAppointmentConfirmation(appointment);

      logger.info(`Payment captured for appointment ${appointment._id}: ${payment.id}`);
    } catch (error) {
      logger.error('Error handling payment captured:', error);
    }
  }

  async handlePaymentFailed(payment) {
    try {
      const appointment = await Appointment.findOne({ 
        'payment.orderId': payment.order_id 
      });

      if (appointment) {
        appointment.payment.status = 'failed';
        await appointment.save();

        await NotificationService.sendPaymentFailureNotification(appointment, {
          error: payment.error_description || 'Payment failed'
        });
      }

      logger.error(`Payment failed for order ${payment.order_id}: ${payment.error_description}`);
    } catch (error) {
      logger.error('Error handling payment failed:', error);
    }
  }

  async handleRefundCreated(refund) {
    try {
      const appointment = await Appointment.findOne({ 
        'payment.transactionId': refund.payment_id 
      });

      if (appointment) {
        appointment.payment.status = 'refunded';
        appointment.payment.refundId = refund.id;
        appointment.payment.refundedAt = new Date();
        await appointment.save();

        logger.info(`Refund processed for appointment ${appointment._id}: ${refund.id}`);
      }
    } catch (error) {
      logger.error('Error handling refund:', error);
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

  async getPaymentDetails(paymentId) {
    try {
      return await this.instance.payments.fetch(paymentId);
    } catch (error) {
      logger.error('Failed to fetch payment details:', error);
      throw error;
    }
  }
}

module.exports = new RazorpayService();