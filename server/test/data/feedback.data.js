module.exports = {
	feedbackTooLong: {
		feedback: 'a',
		rate: 4,
		target: 'clinic'
	},
	feedbackTooShort: {
		feedback: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		rate: 4,
		target: 'clinic'
	},
	rateTooSmall: {
		feedback: 'aaaaaa',
		rate: -1,
		target: 'clinic'
	},
	rateTooBig: {
		feedback: 'aaaaaa',
		rate: 6,
		target: 'clinic'
	},
	properFeedback: {
		feedback: 'aaaaaa',
		rate: 4,
		target: 'clinic'
	}
};