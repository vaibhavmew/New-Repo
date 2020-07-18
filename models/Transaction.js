const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  sender: {
    type: Number,
  },
  receiver: {
    type: Number,
  },
  details: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
