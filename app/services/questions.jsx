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
	questionDryrun(id, answer) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2')}/questions/${id}/dryrun`,
			method: 'POST',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify({
				answer
			})
		});
	},
	getQuestionById(id) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/questions/${id}`,
			method: 'GET',
			headers: {
				'x-access-token' : config.getToken()
			}
		});
	},
	editQuestion(id, data) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/questions/${id}`,
			method: 'PUT',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(data)
		});
	},
	deleteQuestion(id) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/questions/${id}`,
			method: 'DELETE',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify()
		});
	}
};