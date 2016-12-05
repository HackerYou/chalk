import config from './config.jsx';

export default {
	createQuestion(question) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/questions`,
			method: 'POST',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(question)
		});
	},
	getQuestion(question) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/questions`,
			method: 'GET',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(question)
		});
	},
};