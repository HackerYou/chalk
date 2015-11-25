import config from './config.jsx';

let userLoggedin = false;

export default {
	authenticated() {
		return userLoggedin
	},
	setLocalStorage(token) {
		localStorage.set('token',token);
	},
	login(email,password) {
		return new Promise((resolve,reject) => {
			$.ajax({
				url: `${config.getApiUrl()}/user/authenticate`,
				method: 'GET',
				data: {
					email: email,
					password: password
				}
			}).then(res => {
				if(res.success) {
					userLoggedin = true;
					this.setLocalStorage(res.token);
					config.getHeaders('x-access-token', res.token);
					resolve({
						success: true
					});
				}	
				else {
					reject({
						success: false
					});
				}
			});
		});
	},
	logOut() {
		this.setLocalStorage('');
	},
	authMixin: {
		willTransitionTo() {
			console.log(this);
			if(!this.authenticated()) {
				this.history.pushState(null,'/');
			}
		}	
	}
};