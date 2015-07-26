$(document).ready(function() {
    
    var canvas = document.getElementById('whiteboard');
	var context = canvas.getContext('2d');
    var socket = io();
    var roomId = window.location.pathname.match(/\/room\/([-0-9a-zA-Z]+)/)[1];
    //As soon as socket connection happens try to load to room
    socket.on('connect', function() {
		socket.emit('joinRoom', roomId);
    });

    socket.on('sendRoomInfo', function(userId) {
        data = {
            userId: userId,
            img: canvas.toDataURL(),
            videoURL: player.getVideoUrl()
        }
        socket.emit('sentRoomInfo',data)
    });
    
    socket.on('enterRoomInfo', function(data) {
        loadCanvasImage(data.img);
    });
        
})
