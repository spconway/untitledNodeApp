var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
	user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'SUBMITTED'
  },
  executionDate: {
    type: Date,
    required: true
  },
  messageId: {
    type: String,
    required: false
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  modificationDate: {
    type: Date
  }
});

var Message = mongoose.model('Message', MessageSchema);

function findByExecutionDateLessThanNowAndSubmitted(cb){
  var date = new Date();
  var now = date.toISOString();
  Message.find({ executionDate: { '$lte': now }, status: "SUBMITTED" }, function(err, data) {
    if(err){
      console.error('Error finding messages: ', err.stack);
      cb(err, null);
    }else{
      cb(null, data);
    }
  });
}

function update(id, values, cb) {
  Message.findByIdAndUpdate(id, values, function(err, data) {
    if(err){
      console.error('Error updating records: ', err);
      cb(err, null);
    }else {
      cb(null, data);
    }
  });
}

module.exports = {
  Message: Message,
  findByExecutionDateLessThanNowAndSubmitted: findByExecutionDateLessThanNowAndSubmitted,
  update: update
};