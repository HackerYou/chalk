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
	getTest(id) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/tests/${id}`,
			method: 'GET',
			headers:{
				'x-access-token': config.getToken()
			}
		});
	}
};