import config from './config.jsx';

export default {
	createTopic(topic) {
		return $.ajax({
			url: `${config.getApiUrl()}/topic`,
			method: 'POST',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(topic)
		});
	},
	getTopicById(id) {
		return $.ajax({
			url: `${config.getApiUrl()}/topic/${id}`,
			method: 'GET',
			headers: {
				'x-access-token' : config.getToken(),
			}
		});
	}
};