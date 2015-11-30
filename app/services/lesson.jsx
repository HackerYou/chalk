import config from './config.jsx';

export default {
	createLesson(lesson){
		return $.ajax({
			url: `${config.getApiUrl()}/lesson`,
			method: 'POST',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(lesson)
		});
	},
	getLessonById(id){
		return $.ajax({
			url: `${config.getApiUrl()}/lesson/${id}`,
			method: 'GET',
			headers: {
				'x-access-token' : config.getToken(),
			}
		});
	}

}