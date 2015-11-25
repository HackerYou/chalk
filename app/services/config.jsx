let headers = {
	'x-access-token': ''
};
let url = 'http://localhost:3200/v1';

export default {
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