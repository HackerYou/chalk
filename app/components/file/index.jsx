import React from 'react';
import { Link } from 'react-router';
import Topic from '../topic/index.jsx';
import CopyToClipboard from 'react-copy-to-clipboard';
import Dropzone from 'react-dropzone';
import Media from '../media/index.jsx';

export default React.createClass({
	displayName: 'File',
	getInitialState(){
		return {
			copied: false
		}
	},
	render() {
		return (
			<li>
				<p><i className="chalk-doc"></i>{this.props.details.name}</p>
				<input type="text" defaultValue={this.props.details.path}/>
				<CopyToClipboard text={this.props.details.path} onCopy={() => this.setState({copied: true})}>
					<button className="success"><i className="chalk-copy"></i></button>
				</CopyToClipboard>
				<button className="error">Delete File</button>
			</li>
			)
	}
});