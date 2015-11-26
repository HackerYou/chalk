import config from './config.jsx';

export default {
	getUser(id) {
		return $.ajax({
			url: `${config.getApiUrl()}/user/${id}`,
			method: 'GET',
			headers: {
				'x-access-token' : config.getToken()
			}
		});
	}
}