import config from './config.jsx';


export default {
	getMedia(){
		return $.ajax({
			url: `${config.getApiUrl()}/media`,
			method: 'GET',
			headers: {
				'x-access-token' : config.getToken(),
			}
		});
	},
	deleteFile(name){
		return $.ajax({
			url: `${config.getApiUrl()}/media/${name}`,
			method: 'DELETE',
			headers: {
				'x-access-token' : config.getToken()
			}
		});
	},
	uploadFile(file) {
		let data = new FormData();
    	data.append( 'file', file[0] );
		return $.ajax({
			url: `${config.getApiUrl()}/media`,
			method: 'POST',
			data: data,
			processData: false,
			contentType: false,
			headers: {
				'x-access-token' : config.getToken()
			}
		});
	}
};