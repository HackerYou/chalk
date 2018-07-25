
let url = 'https://readme-api.hackeryou.com/v1';
// let url = 'http://localhost:3200/v1';
// let url = 'http://138.197.175.159/v1';
let appName = 'chalk';

export default {
	getAppName() {
		return appName;
	},
	getApiUrl() {
		return url;
	},
	getUserId() {
		return localStorage.getItem(`${appName}_user_id`);
	},
	getToken() {
		return localStorage.getItem(`${appName}_token`);
	}
};
