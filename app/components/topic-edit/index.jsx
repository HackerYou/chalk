import React from 'react';
import { Link } from 'react-router';
import Topic from '../topic/index.jsx';
import CopyToClipboard from 'react-copy-to-clipboard';
import Dropzone from 'react-dropzone';
import AuthMixin from '../../services/authMixin.jsx';
import topicData from '../../services/topic.jsx';

export default React.createClass({
	displayName: 'EditTopics',
	getInitialState(){
		return {
			topic: [],
			files: [],
			copied: false
		}
	}, 
	componentWillMount(){
		topicData.getTopicById(this.props.params.topicId).then(data => {
			this.setState({
				topic: data.topic
			});
		});
	},
	onDrop(files){
		this.setState({files: this.state.files.concat(files)});	
	},
	editTopic(e) {
		e.preventDefault();
		topicData.updateTopic( this.state.topic._id, {
			title: this.refs.name.value,
			category: this.refs.category.value
		}).then(res => {
			this.history.pushState(null,`/topics/`);
		});
	},
	render() {
		return (
			<div>
				<Link className="linkBtn" to="topics"><button className="primary"><i className="chalk-home"></i>back to topics</button></Link>
					<form action="" className="card" onSubmit={this.editTopic}>
						<label htmlFor="name">Name</label>
						<input type="text" placeholder="Topic Name" value={this.state.topic.title} ref="name"/>
						<label htmlFor="category">Category</label>
						<select name="category" id="category" ref="category">
							<option value="html&css">HTML & CSS</option>
							<option value="javascript">JavaScript</option>
							<option value="git">Git</option>
							<option value="wordpress">WordPress</option>
							<option value="tools">Tools</option>
							<option value="workflow">Workflow</option>
						</select>
						<label htmlFor="objective">Topic Objective</label>
						<input type="text" placeholder="Enter the key learning outcome associated with this topic" />
						<label htmlFor="time">Time Estimate</label>
						<input type="text" placeholder="enter a number in minutes"/>
						<button className="success">Save Topic</button>
						<Link className="linkBtn" to="topics">
							<button className="error">Cancel</button>
						</Link>
							<textarea name="" id="" cols="140" rows="30"></textarea>
							<h3>Media</h3>
							<Dropzone onDrop={this.onDrop}>
								<p>Drag and drop files here or click to select files to upload</p>
							</Dropzone>
							<ul>{this.state.files.map((file, index) => 
								<li key={index}>
									<p><i className="chalk-doc"></i>{file.name}</p>
									<input type="text" defaultValue={file.preview}/>
									<CopyToClipboard text={file.preview} onCopy={() => this.setState({copied: true})}>
										<button className="success"><i className="chalk-copy"></i></button>
									</CopyToClipboard>
									<button className="error">Delete File</button>
								</li>
							)}</ul>
							<button className="success">Save Topic</button>
							<Link className="linkBtn" to="topics">
								<button className="error">Cancel</button>
							</Link>
					</form>
			</div>
			)
}
});