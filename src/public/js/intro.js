window.onload = () => {
  //  let images = document.getElementsByTagName('img');
  //   const canvas  = document.getElementById('canvas1');
  //   const context = canvas.getContext('2d');
    const images = document.getElementsByTagName('canvas');

    let namespace = io('/namespace');
    namespace.on('connect', (socket)=>{
        namespace.emit('getImage');
    });

    namespace.on('drawPreview', (data)=>{
        console.log('drawImage emitted');
        drawPreview(data);
    });

    function drawPreview (data){
        for (let i = 0; i < 4; i++) {

            for (let j = 0; j < data[i].length; j++) {
                const context = images[i].getContext('2d');
                context.lineJoin = "round";
                context.beginPath();
                context.lineWidth   = data[i][j].width*0.45;
                context.strokeStyle = data[i][j].color;
                context.moveTo(data[i][j].beginPointX*0.45, data[i][j].beginPointY*0.3);
                context.lineTo(data[i][j].endPointX*0.45, data[i][j].endPointY*0.3);
                context.closePath();
                context.stroke();
                //       context.moveTo(pointsArray[i].endPointX, pointsArray[i].endPointY);
            }

        }

    };



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