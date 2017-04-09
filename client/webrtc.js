const localVideo = document.getElementById('local_video');
const remoteVideo = document.getElementById('remote_video');
const textForSendSdp = document.getElementById('text_for_send_sdp');
const textToReceiveSdp = document.getElementById('text_for_receive_sdp');
let localStream = null;
let peerConnection = null;

function startVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(function (stream) { // success
        playVideo(localVideo, stream);
        localStream = stream;
    }).catch(function (error) { // error
        console.error("mediaDevice.getUserMedia() error: ", error);
        return;
    });
}

function playVideo(elemenet, stream) {
    element.srcObject = stream;
    element.play();
}

