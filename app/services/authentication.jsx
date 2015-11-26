import config from './config.jsx';


export default {
	authenticated() {
		return localStorage.getItem(`${config.getAppName()}_loggedIn`);
	},
	setLocalStorage(options) {
		Object.keys(options).map(key => {
			localStorage.setItem(key,options[key]);
		});
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
					let options = {};
					options[`${config.getAppName()}_loggedIn`] = true;
					options[`${config.getAppName()}_token`] = res.token;
					this.setLocalStorage(options);

					config.getHeaders('x-access-token', res.token);
					resolve({
						success: true
					});
				}	
				else {
					reject(res);
				}
			});
		});
	},
	logOut() {
		let options = {};
		options[`${config.getAppName()}_loggedIn`] = false;
		options[`${config.getAppName()}_token`] = '';
		this.setLocalStorage(options);
	}
};