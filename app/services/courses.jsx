import config from './config.jsx';

export default {
	getCourses(){
		return $.ajax({
			url: `${config.getApiUrl()}/course`,
			method: 'GET',
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	getTemplates(){
		return $.ajax({
			url: `${config.getApiUrl()}/course/template`,
			method: 'GET',
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	createTemplate(course){
		return $.ajax({
			url: `${config.getApiUrl()}/course/template`,
			method: 'POST',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(course)
		});
	},
	createCourse(data){
		return $.ajax({
			url: `${config.getApiUrl()}/course`,
			method: 'POST', 
			headers: {
				'x-access-token': config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(data)
		});
	},
	deleteCourse(id){
		return $.ajax({
			url: `${config.getApiUrl()}/course/${id}`,
			method: 'DELETE',
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	addUserToCourse(courseId, emails){
		return $.ajax({
			url: `${config.getApiUrl()}/course/${courseId}/user`,
			method: 'POST',
			headers: {
				'x-access-token': config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				'emails': emails
			}) 
		});
	},
	removeUserFromCourse(courseId, userId){
		return $.ajax({
			url: `${config.getApiUrl()}/course/${courseId}/user/${userId}`,
			method: 'DELETE',
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	getTemplateById(id){
		return $.ajax({
			url: `${config.getApiUrl()}/course/template/${id}`,
			method: 'GET',
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	getCourseById(id){
		return $.ajax({
			url: `${config.getApiUrl()}/course/${id}`,
			method: 'GET',
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	addSectionToCourse(id, data	){
		return $.ajax({
			url: `${config.getApiUrl()}/course/${id}/section`,
			method: 'POST',
			headers: {
				'x-access-token': config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(data)
		});
	},
	removeSectionFromCourse(courseId, sectionId){
		return $.ajax({
			url: `${config.getApiUrl()}/course/${courseId}/section/${sectionId}`,
			method: 'DELETE',
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	getSection(sectionId){
		return $.ajax({
			url: `${config.getApiUrl()}/course/section/${sectionId}`,
			method: 'GET', 
			headers: {
				'x-access-token': config.getToken()
			}
		});
	},
	updateSection(sectionId, data){
		return $.ajax({
					url: `${config.getApiUrl()}/course/section/${sectionId}`,
					method: 'PUT', 
					headers: {
						'x-access-token': config.getToken(),
						'Content-Type': 'application/json'
					},
					data: JSON.stringify(data)
				});
	},
	updateCourse(courseId, data){
		return $.ajax({
			url: `${config.getApiUrl()}/course/${courseId}`,
			method: 'PUT', 
			headers: {
				'x-access-token': config.getToken(),
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(data)
		});
	},
	addLessonToSection(sectionId, lessonId){
		return $.ajax({
			url: `${config.getApiUrl()}/course/section/${sectionId}/lesson/${lessonId}`,
			method: 'PUT',
			headers: {
				'x-access-token': config.getToken(),
				'Content-Type': 'application/json'
			}
		});
	}	
}