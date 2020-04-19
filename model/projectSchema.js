const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'projectName is required']
  },
  amount: {
    type:  Number,
    required: [true, 'amount is required']
    },
    createDate: {
        type:  Date,
    },
    editDate: {
        type:  Date,
    },
    finishFlag: {
        type:  Boolean,
        required: [true, 'flag is required']
    },
    corporateCaseFlag: {
        type:  Boolean,
        required: [true, 'corporateCaseFlag is required']
    },
    detail: {
        type:  String,
        required: [true, 'detail is required']
    },
    demandSkill: {
        type:  String,
        required: [true, 'demandSkill is required']
    },
    applicants: {
        type:  Number,
    },
    paymentDate: {
        type:  Date,
        required: [true, 'paymentDate is required']
    },
    userId: {
        type:  String,
        required: [true, 'userId is required']
    },
})

module.exports = mongoose.model('project', projectSchema, 'project');