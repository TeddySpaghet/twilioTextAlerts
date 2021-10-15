require('dotenv').config();

const mongoose = require('mongoose');
const twilio = require('twilio');

const OrderSchema = new mongoose.Schema({
  customerName: String,
  customerPhoneNumber: String,
  status: {type: String, default: 'Ready'},
  notificationStatus: {type: String, default: 'None'},
});

OrderSchema.methods.sendSmsNotification = function(message, mediaUrl = "http://lorempixel.com/image_output/fashion-q-c-640-480-1.jpg", statusCallback) {
  if (!statusCallback) {
    throw new Error('status callback is required to send notification.');
  }
  if (!mediaUrl) {
    throw new Error('media url is required.');
  }
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const options = {
    to: this.customerPhoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: message,
    mediaUrl: mediaUrl,
    statusCallback: statusCallback,
  };

  return client.messages.create(options)
    .then((message) => {
      console.log('Message sent to ' + message.to);
    });
};


const Order = mongoose.model('order', OrderSchema);
module.exports = Order;
