import React from 'react';
import { Link , History } from 'react-router';
import Topic from '../topic/index.jsx';
import CopyToClipboard from 'react-copy-to-clipboard';
import Dropzone from 'react-dropzone';
import AuthMixin from '../../services/authMixin.jsx';
import topicData from '../../services/topic.jsx';
import TabMixin from '../../services/tabMixin.jsx';
import media from '../../services/media.jsx';
import NotificationSystem from 'react-notification-system';

export default React.createClass({
	_notificationSystem: null,
	displayName: 'EditTopics',
	mixins:[AuthMixin,History, TabMixin],
	getInitialState(){
		return {
			topic: [],
			files: [],
			copied: false,
			category: 'HTML & CSS'
		}
	},
	componentDidMount() {
		this._notificationSystem = this.refs.notificationSystem;
	},
	componentWillMount(){
		topicData.getTopicById(this.props.params.topicId).then(data => {
			this.setState({
				topic: data.topic
			});
		});
	},
	onDrop(files){
		media.uploadFile(files).then(res => {
			this.setState({files: this.state.files.concat(res.media)});
		});
	},
	_successNotification: function() {
    this._notificationSystem.addNotification({
      message: 'Saved Successfully',
      level: 'success',
			dismissible: false,
			title: 'Topic'
    });
  },
	editTopic(e) {
		e.preventDefault();
		topicData.updateTopic( this.state.topic._id, {
			title: this.refs.name.value,
			category: this.refs.category.value,
			description: this.refs.description.value,
			body : this.refs.body.value,
			"time": this.refs.time.value
		}).then(res => {
			this._successNotification();
		});
		// .then(res => {
		// 	this.history.pushState(null,`/topics`);
		// 	this.setState
		// });
	},
	deleteTopic(e){
		e.preventDefault();
		topicData.deleteTopic(this.state.topic._id).then(res =>{
			this.history.pushState(null, `/topics`);
		});
	},
	handleChange(e){
		let stateObj = this.state.topic;
		stateObj[e.target.id] = e.target.value;
		this.setState({
			topic: stateObj
		});
	},
	render() {
		let savedText = (
			<p><small>Saved</small></p>
		);
		return (
			<div>
				<NotificationSystem ref="notificationSystem" style={false}/>
				<div className="container">
					<header className="topContent">
						<Link className="linkBtn" to="/topics"><button className="primary"><i className="chalk-home"></i>back to topics</button></Link>
						<button onClick={this.deleteTopic} className="error"><i className="chalk-remove"></i>delete topic</button>
					</header>
				</div>
				<form action="" onSubmit={this.editTopic} >
					<section className="full topicsEdit">
						<div className="card topicRow">
							<div className="fieldRow">
								<label htmlFor="name" className="inline">Name</label>
								<input type="text" placeholder="Topic Name" value={this.state.topic.title} onChange={this.handleChange} id="title" ref="name" className="topicLong"/>
							</div>
							<div className="fieldRow">
								<label htmlFor="category" className="inline">Category</label>
								<select name="category" id="category" onChange={this.handleChange}ref="category" value={this.state.topic.category}>
									<option value="html&css">HTML & CSS</option>
									<option value="javascript">JavaScript</option>
									<option value="git">Git</option>
									<option value="wordpress">WordPress</option>
									<option value="tools">Tools</option>
									<option value="workflow">Workflow</option>
								</select>
								<label htmlFor="time" className="inline">Time</label>
								<input id="time" onChange={this.handleChange} value={this.state.topic.time} ref="time" type="text" placeholder="enter a number in minutes"/>
							</div>
							<div className="fieldRow">
								<label htmlFor="objective" className="inline">Topic Objective</label>
								<input ref="description" id="description" onChange={this.handleChange} type="text" value={this.state.topic.description} placeholder="Enter the key learning outcome associated with this topic" className="topicLong"/>
							</div>
							<button className="success">Save Topic</button>
							<Link className="linkBtn" to="topics">
								<button className="error">Cancel</button>
							</Link>
						</div>
						<div className="card topicRow">
							<textarea className="markdown" onKeyDown={TabMixin.keyHandler} value={this.state.topic.body} ref="body" name="" id="body" onChange={this.handleChange}>
							</textarea>
							<h3>Media</h3>

							<Dropzone onDrop={this.onDrop} className="dropZone">
								<p>Drag and drop files here or click to select files to upload</p>
							</Dropzone>
							<ul className="uploadedFiles">{this.state.files.map((file, index) =>
								<li key={index} className="mediaRow">
									<p className="mediaIcon"><i className="chalk-doc"></i>{file.name}</p>
									<div className="mediaLink">
										<input type="text" defaultValue={file.path}/>
										<CopyToClipboard text={file.path} onCopy={() => {this.setState({copied: true}); }}>
											<button className="success mediaCopy"><i className="chalk-copy"></i></button>
										</CopyToClipboard>
									</div>
								</li>
							)}</ul>
							<button className="success">Save Topic</button>
							<Link className="linkBtn" to="topics">
								<button className="error">Cancel</button>
							</Link>
						</div>
					</section>
				</form>
			</div>
			)
}
});
