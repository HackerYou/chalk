import config from './config.jsx';

export default {
	getTemplates() {
		return $.ajax({
			url: `${config.getApiUrl()}/course`,
			method: 'GET',
			headers: {
				'x-access-token' : config.getToken(),
			}
	},
	addTemplate(course){
		return $.ajax({
			url: `${config.getApiUrl()}/course`,
			method: 'POST',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(course);
		});
	}
};