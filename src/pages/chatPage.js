import React, { useState, useRef} from 'react';
import { Chat } from './chatapp';

const ChatPage = () => {

    const [room,setRoom]=useState(null)

    const roomInputRef= useRef(null);

  return (
    <div>
        {room ? (
            <div><Chat room={room} /></div>
        ):(
            <div className='room'>
                <label>Enter Room Name</label>
                <input ref={roomInputRef}/>
                <button onClick={()=>setRoom(roomInputRef.current.value)}>Enter Chat</button>
            </div>
        )
        }
    </div>
  );
};

export default ChatPage;
