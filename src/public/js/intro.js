window.onload = () => {
    let images = document.getElementsByTagName('img');

    images[0].onclick = () => {
        console.log("image room 1 clicked");
        let rooms = io('/rooms');
        rooms.on('connect', ()=>{
            rooms.emit('img_click', {room: 1});
        });

        rooms.on('joinRoom', (data)=>{
            alert('Room '+data.roomname+ ' joined');
            location.assign(data.location);
        });

        if(rooms){
            console.log(rooms);
            rooms.emit('getPainting')
        }
    }

    images[1].onclick = () => {
        console.log("image room 2 clicked");
        let rooms = io('/rooms');
        rooms.on('connect', ()=>{
            rooms.emit('img_click', {room: 2});
        });

        rooms.on('joinRoom', (data)=>{
            alert('Room '+data.roomname+ ' joined');
        });


    }

    images[2].onclick = () => {
        console.log("image room 3 clicked");
        let rooms = io('/rooms');
        rooms.on('connect', ()=>{
            rooms.emit('img_click', {room: 3});
        });

        rooms.on('joinRoom', (data)=>{
            alert('Room '+data.roomname+ ' joined');
        });
    }

    images[3].onclick = () => {
        console.log("image room 4 clicked");
        let rooms = io('/rooms');
        rooms.on('connect', ()=>{
            rooms.emit('img_click', {room: 4});
        });

        rooms.on('joinRoom', (data)=>{
            alert('Room '+data.roomname+ ' joined');
        });
    }
}