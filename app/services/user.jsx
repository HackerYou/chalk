import config from './config.jsx';

let user = {};

export default {
	getStoredUser() {
		return user;
	},
	storeUser(user) {
		user = user;
	},
	getUser(id) {
		return $.ajax({
			url: `${config.getApiUrl()}/user/${id}`,
			method: 'GET',
			headers: {
				'x-access-token' : config.getToken()
			}
		});
	},
	updateUser(model) {
		return $.ajax({
			url: `${config.getApiUrl()}/user/${model._id}`,
			method: 'PUT',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(model)
		});
	},
	lostPassword(email) {

	}
};









