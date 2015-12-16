import config from './config.jsx';

let _user = {};

export default {
	getStoredUser() {
		return _user;
	},
	storeUser(user) {
		console.log(user);
		_user = user;
	},
	addUser(email){
		return $.ajax({
			url: `${config.getApiUrl()}/user`,
			method: 'POST',
			headers: {
				'x-access-token': config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				'emails': email
			})
		});
	},
	getUsers(){
		return $.ajax({
			url: `${config.getApiUrl()}/user`,
			method: 'GET',
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	getInstructors(){
		return $.ajax({
			url: `${config.getApiUrl()}/user`,
			method: 'GET',
			headers: {
				'x-access-token': config.getToken()
			},
			data: {
				'instructor': true
			}
		});
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
	deleteUser(id){
		return $.ajax({
			url: `${config.getApiUrl()}/user/${id}`,
			method: 'DELETE',
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	updateUser(model) {
		let id = model._id;
		// delete model._id;
		return $.ajax({
			url: `${config.getApiUrl()}/user/${id}`,
			method: 'PUT',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(model)
		});
	},
	lostPassword(email) {
		return $.ajax({
			url: `${config.getApiUrl()}/user/reset/${email}`,
			method: 'PUT',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type': 'application/json'
			}
		});
	}
};









