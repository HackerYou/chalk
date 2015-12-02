import config from './config.jsx';

export default {
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
	deleteCourse(id){
		return $.ajax({
			url: `${config.getApiUrl()}/course/${id}`,
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