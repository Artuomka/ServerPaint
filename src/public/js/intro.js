window.onload = () => {
    let images = document.getElementsByTagName('img');

    images[0].onclick = () => {
        console.log("image room 1 clicked");
        let rooms = io('/namespace');
        rooms.on('connect', ()=>{
            rooms.emit('img_click', {room: 1});
        });

        rooms.on('joinRoom', (data)=>{
            document.cookie ="room="+data.roomname;
            alert('Room '+data.roomname+ ' joined');
         //   window.location.replace(data.location)
           location.assign(data.location);
        });

    }

    images[1].onclick = () => {
        console.log("image room 2 clicked");
        let rooms = io('/namespace');
        rooms.on('connect', ()=>{
            rooms.emit('img_click', {room: 2});
        });

        rooms.on('joinRoom', (data)=>{
            document.cookie ="room="+data.roomname;
            alert('Room '+data.roomname+ ' joined');
            //   window.location.replace(data.location)
            location.assign(data.location);
        });


    }

    images[2].onclick = () => {
        console.log("image room 3 clicked");
        let rooms = io('/namespace');
        rooms.on('connect', ()=>{
            rooms.emit('img_click', {room: 3});
        });

        rooms.on('joinRoom', (data)=>{
            document.cookie ="room="+data.roomname;
            alert('Room '+data.roomname+ ' joined');
            //   window.location.replace(data.location)
            location.assign(data.location);
        });
    }

    images[3].onclick = () => {
        console.log("image room 4 clicked");
        let rooms = io('/namespace');
        rooms.on('connect', ()=>{
            rooms.emit('img_click', {room: 4});
        });

        rooms.on('joinRoom', (data)=>{
            document.cookie ="room="+data.roomname;
            alert('Room '+data.roomname+ ' joined');
            //   window.location.replace(data.location)
            location.assign(data.location);
        });
    }
}