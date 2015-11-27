import React from 'react';
import { Link } from 'react-router';
import Classroom from '../classroom/index.jsx';

export default React.createClass({
	displayName: "EditClassroom",
	render() {
		return (
			<div>
				<Link to="/classroom" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
				<form action="">
					<h2>Edit Classroom</h2>
					<label htmlFor="name">Classroom Name</label>
					<input type="text" id="name"/>
					<label htmlFor="season">Season</label>
					<input type="text" id="season"/>
					<label htmlFor="instructor">Instructor</label>
					<select name="instructor" id="instructor">
						<option value="1">Ryan Christiani</option>
						<option value="2">Drew Minns</option>
						<option value="3">Kristen Spencer</option>
					</select>
					<label htmlFor="description">Classroom Description</label>
					<textarea name="description" id="description" cols="30" rows="10"></textarea>
					<button className="success">Save Classroom</button>
					<button className="error">Delete Classroom</button>
				</form>
				<Classroom />
			</div>
		)
	}
});