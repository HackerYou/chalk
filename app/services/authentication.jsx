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
					options[`${config.getAppName()}_user_id`] = res.user_id;
					this.setLocalStorage(options);
					resolve({
						success: true
					});
				}	
				else {
					this.logOut();
					reject(res);
				}
			});
		});
	},
	logOut() {
		let options = {};
		options[`${config.getAppName()}_loggedIn`] = false;
		options[`${config.getAppName()}_token`] = '';
		options[`${config.getAppName()}_user_id`] = '';
		this.setLocalStorage(options);
	}
};