import React, { useState } from 'react'
import './User.css'
import blockProps from '../../../types'
import pencil from './pencil.svg'
import socket from '../../../socket'
import JSCookies from 'js-cookie'


export const User = (props: blockProps) => {
  const [profilePic, setProfilePic] = useState<string>(props.userdata?.picture_url || '');
  const [haveChanges, setHaveChanges] = useState<boolean>(false);
  const [isUsernameEditable, setIsUsernameEditable] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(props.userdata?.username || '');
  const [prevUsername, setPrevUsername] = useState<string>(props.userdata?.username || '');

  async function formSubmit(e: any) {
    e.preventDefault();
    const myCookie = JSCookies.get('accessToken');
    socket.emit('userUpdate', {
      myCookie,
      picture_url: profilePic,
      username,
    });
    socket.on('userUpdate',(data) => {
      if (data !== '') {
        alert(data.message);
        setUsername(prevUsername);
      }
      else
        setPrevUsername(username);
    });
    setHaveChanges(false);
    setIsUsernameEditable(false);
  }

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
    setHaveChanges(true);
  }

  function handleImageChange(e: any) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfilePic(reader.result as string);
        setHaveChanges(true);
      };
    }
  }

  return (
    <div className='user'>
      <div>
        <form onSubmit={formSubmit}>
          <hr />
          <img src={profilePic} alt='avatar' />
          <h1>
            {isUsernameEditable ? (
              <>
                <input type="text" value={username} onChange={handleUsernameChange} />
                <label htmlFor="imageInput" className="custom-file-upload">
                  Change picture
                </label>
              </>
            ) : (
              <>
                {username}
                <button className="pencil-button" onClick={() => setIsUsernameEditable(!isUsernameEditable)}>
                  <img src={pencil} alt="Edit" />
                </button>
              </>
            )}
          </h1>
          <input type="file" id="imageInput" onChange={handleImageChange} />
          <hr />
          { haveChanges && (
            <button> Submit changes </button>
          )}
        </form>
      </div>
    </div>
  )
}