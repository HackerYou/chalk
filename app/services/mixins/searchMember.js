'use strict'

export default {
	searchMembers(event) {
		event.preventDefault();
		let searchQuery = new RegExp(this.refs.searchQuery.value,'ig');
		let originalMembers = this.originalMembers;

		if(searchQuery  === '') {
			this.setState({
				members: originalMembers
			});
		}
		else {
			this.setState({
				members: originalMembers.filter(member => {
					if(member.firstName) {
						return member.firstName.match(searchQuery) 
					}
					else {
						return false;
					}
				})
			});
		}
	}
}