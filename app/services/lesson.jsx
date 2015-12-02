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
	},
	updateLesson(id, data){
		return $.ajax({
			url: `${config.getApiUrl()}/lesson/${id}`,
			method: 'PUT',
			headers: {
				'x-access-token': config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(data)
		});
	},
	addTopicToLesson(lessonId, topicId, data){
		return $.ajax({
			url: `${config.getApiUrl()}/lesson/${lessonId}/topic/${topicId}`,
			method: 'PUT',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(data)
		});
	},
	deleteTopicFromLesson(lessonId, topicId){
		return $.ajax({
			url: `${config.getApiUrl()}/lesson/${lessonId}/topic/${topicId}`,
			method: 'DELETE',
			headers: {
				'x-access-token' : config.getToken()
			}
		});
	}

}