import React from 'react';
import { Link } from 'react-router';
import Topic from '../topic/index.jsx';
import CopyToClipboard from 'react-copy-to-clipboard';
import Dropzone from 'react-dropzone';

export default React.createClass({
	displayName: 'EditTopics',
	getInitialState(){
		return {
			topics: [],
			files: [],
			copied: false
		}
	}, 
	componentWillMount(){
		let data = require('../sample-data.js');
		this.setState({
			topics: data.lesson.topic
		});
	},
	renderTopics(key, index){
		return <Topic key={index} index={index} details={this.state.topics[index]} />
	},
	onDrop(files){
		this.setState({files: this.state.files.concat(files)});	
	},
	render() {
		return (
			<div>
				<Link className="linkBtn" to="topics"><button className="primary"><i className="chalk-home"></i>back to topics</button></Link>
				<form  className="card" action="">
					<label htmlFor="name">Name</label>
					<input type="text" placeholder="Topic Name"/>
					<label htmlFor="category">Taxonomy</label>
					<input type="text" placeholder="Topic Category"/>
					<label htmlFor="objective">Topic Objective</label>
					<input type="text" placeholder="Enter the key learning outcome associated with this topic"/>
					<label htmlFor="time">Time Estimate</label>
					<input type="text" placeholder="eg 30min"/>
					<button className="success">Save Topic</button>
					<button className="error">Cancel</button>
				</form>
				<div className="card">
					<textarea name="" id="" cols="140" rows="30"></textarea>
					<h3>Media</h3>
					<Dropzone onDrop={this.onDrop}>
					<p>Drag and drop files here or click to select files to upload</p>
					</Dropzone>
					<div>{this.state.files.map((file, index) => 
						<div key={index}>
							<p><i className="chalk-doc"></i>{file.name}</p>
							<input type="text" defaultValue={file.preview}/>
							<CopyToClipboard text={file.preview} onCopy={() => this.setState({copied: true})}>
							<button className="success"><i className="chalk-copy"></i></button>
							</CopyToClipboard>
							<button className="error">Delete File</button>
						</div>
					)}</div>
					<button className="success">Save Topic</button>
					<button className="error">Cancel</button>
				</div>
			</div>
		)
	}
});