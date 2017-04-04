import config from './config.jsx';

export default {
	createIssue(issue) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/flaggedIssues`,
			method: 'POST',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(issue)
		});
	},
	getAllIssues() {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/flaggedIssues`,
			method: 'GET',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			}
		});
	},
	removeIssueById(id) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/flaggedIssues/${id}`,
			method: 'DELETE',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			}
		});
	},
	updateIssueById(id, issue) {
		return $.ajax({
			url: `${config.getApiUrl().replace('v1','v2') }/flaggedIssues/${id}`,
			method: 'PUT',
			headers: {
				'x-access-token' : config.getToken(),
				'Content-Type' : 'application/json'
			},
			data: JSON.stringify(issue)
		})
	}
}