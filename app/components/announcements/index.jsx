import React from 'react';
import Announcement from '../announcement/index.jsx';
import Modal from '../modal/index.jsx';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');


export default React.createClass({
	displayName: 'Announcements',
	getInitialState(){
		return{
			announcements: {},
			isModalOpen: false
		}
	},
	openModal(){
		this.setState({isModalOpen: true});
	},
	closeModal(){
		this.setState({isModalOpen: false});
	},
	componentDidMount(){
		let data = require('../sample-data.js');
		this.setState({
			announcements: data.announcement
		});
	},
	renderAnnouncements(key){
		return <Announcement key={key} index={key} details={this.state.announcements[key]} />
	},
	render() {
		return (
			<aside>
				<h3>Announcements</h3>
				<ul>
					{Object.keys(this.state.announcements).map(this.renderAnnouncements)}
				</ul>
				<button className="success" onClick={this.openModal}>Make Announcement</button>
				<Modal isOpen={this.state.isModalOpen} transitionName='modal-animation'>
					<i className="chalk-close" onClick={this.closeModal}></i>
					<h2>Make Announcement</h2>
					<form action="">
						<label htmlFor="title">Title</label>
						<input type="text" placeholder="title" id="title"/>
						<label>Audience</label>
						<button>Classroom Name</button>
						<label htmlFor="announcement">Announcement</label>
						<textarea name="announcement" id="announcement" cols="30" rows="10"></textarea>
						<label htmlFor="attachments">Attachments</label>
						<input type="file"/>
						<button className="primary">Publish Announcement</button>
						<button>Cancel</button>	
					</form>					
				</Modal>
			</aside>
		);
	}
});