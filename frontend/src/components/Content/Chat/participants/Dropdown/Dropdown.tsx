import React, { useState, useCallback } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";
import './Dropdown.css';

const MyDropdown = (props: any) => {

	function sendPm() {
		console.log('click');
	}

	return (
		<Dropdown>
		<Dropdown.Toggle variant="custom" id="dropdown-basic">
			<BsGearFill/>
		</Dropdown.Toggle>

		<Dropdown.Menu>
			<Dropdown.Item onClick={sendPm}>Send DM</Dropdown.Item>
			<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
			<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
		</Dropdown.Menu>
		</Dropdown>
  	);
};

export default MyDropdown;
