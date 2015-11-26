
let url = 'http://notes-api.hackeryou.com/v1';
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
	},
	getHeaders() {
		return headers;
	}
};