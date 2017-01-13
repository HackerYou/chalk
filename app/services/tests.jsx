import config from './config.jsx';

export default {
	createTest(test) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/tests`,
			method: 'POST',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(test)
		});
	},
	updateTest(id, data) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/tests/${id}/question`,
			method: 'PUT',
			headers:{
				'x-access-token': config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(data)
		});
	},
	editTest(id, data) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2')}/tests/${id}`,
			method: 'PUT',
			headers:{
				'x-access-token': config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(data)
		});
	},
	addUser(id) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/tests/${id}/user`,
			method: 'PUT',
			headers:{
				'x-access-token': config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				userId: config.getUserId()
			})
		});
	},
	getTest(id) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/tests/${id}`,
			method: 'GET',
			headers:{
				'x-access-token': config.getToken()
			}
		});
	},
	removeQuestion(id,questionId) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/tests/${id}/question`,
			method: 'DELETE',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(questionId)
		});
	},
	evaluateTest(userId, testId, answer) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/tests/${testId}/evaluate`,
			method: 'POST',
			headers:{
				'x-access-token': config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify({
				userId,
				answers: answer
			})
		});
	},
	getAllTests() {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/tests`,
			method: 'GET',
			headers:{
				'x-access-token': config.getToken()
			}
		});
	},
	removeTest(id) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/tests/${id}`,
			method: 'DELETE',
			headers:{
				'x-access-token': config.getToken()
			}
		});
	}
};