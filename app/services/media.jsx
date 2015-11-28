import config from './config.jsx';


export default {
	uploadFile(file) {
		let data = new FormData();
    	data.append( 'file', file[0] );
		return $.ajax({
			url: `${config.getApiUrl()}/media`,
			method: 'POST',
			data: data,
			processData: false,
			contentType: false
		});
	}
};