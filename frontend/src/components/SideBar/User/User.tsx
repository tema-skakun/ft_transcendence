// import avatar from '../../../42.png'
import React, { useState } from 'react'
import './User.css'
import blockProps from '../../../types'


export const User = (props: blockProps) => {
	const [filebase64, setFileBase64] = useState<string>(props.userdata?.picture_url || '');
	const [haveChanges, sethaveChanges] = useState<boolean>(false);

	function formSubmit(e: any) {
		e.preventDefault();
		alert("here you'd submit the form using\n the filebase64 like any other field")
		sethaveChanges(false);
	}

	function convertFile(files: FileList|null) {
		if (files) {
			const fileRef = files[0] || ""
			const fileType: string= fileRef.type || ""
			const reader = new FileReader()
			reader.readAsBinaryString(fileRef)
			reader.onload=(ev: any) => {
			setFileBase64(`data:${fileType};base64,${window.btoa(ev.target.result)}`)
			sethaveChanges(true);
			}
		}
	}
	return (
		<div className='user'>
			<div>
				<form onSubmit={formSubmit}>
				<hr />
				<img src={filebase64} alt='avatar' />
				<h1>{props.userdata?.username}</h1>
				<input type="file" onChange={(e)=> convertFile(e.target.files)} />
				{ haveChanges && <>
					<hr />
					<button> Submit changes </button>
					</>
				}
				</form>
			</div>
		</div>
	)
}