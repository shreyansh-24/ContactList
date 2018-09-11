const mongoose = require('mongoose');


const contactSchema = mongoose.Schema({
  cname: { type: String, required: true },
  cnum: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Contact', contactSchema);
