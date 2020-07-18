const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
  sender: {
    type: Number,
  },
  receiver: {
    type: Number,
  },
  status: {
    type: Boolean,
  }
  
});

const Beneficiary = mongoose.model('Beneficiary', BeneficiarySchema);

module.exports = Beneficiary;
