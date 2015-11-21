'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
	feedback: {
		type: String,
		validate: {
			validator: function(value) {
				return typeof value == 'string'
					&& value.length >= 5
					&& value.length <= 50;
			},
			message: 'Feedback message is invalid. It must be string, with length from 5 to 50'
		}
	},
	rate: {
		type: Number,
		validate: {
			validator: function(value) {
				return typeof value == 'number'
					&& value >= 0
					&& value <= 5;
			},
			message: 'Feedback Rate is invalid. It must be number, from 0 to 5'
		}
	},
	author: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	target: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	targetType: {
		type: String
	}
});

module.exports = mongoose.model('Feedback', FeedbackSchema);