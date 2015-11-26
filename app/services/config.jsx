let headers = {
	'x-access-token': ''
};
let url = 'http://notes-api.hackeryou.com/v1';
let appName = 'chalk';

export default {
	getAppName() {
		return appName;
	},
	getApiUrl() {
		return url;
	},
	getHeaders() {
		return headers;
	},
	setHeaders(header,value) {
		headers[header] = value;
	}
};