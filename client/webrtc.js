const localVideo = document.getElementById('local_video');
const remoteVideo = document.getElementById('remote_video');
const textForSendSdp = document.getElementById('text_for_send_sdp');
const textToReceiveSdp = document.getElementById('text_for_receive_sdp');
let localStream = null;
let peerConnection = null;

function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function (stream) { // success
            playVideo(localVideo, stream);
            localStream = stream;
        }).catch(function (error) { // error
            console.error("mediaDevice.getUserMedia() error: ", error);
            return;
        });
}

function playVideo(element, stream) {
    element.srcObject = stream;
    element.play();
}

function stopVideo(element, stream) {
    console.log("stopVideo: not implemented");
}

// WebRTCを利用する準備をする
function prepareNewConnection() {
    // RTCPeerConnectionを初期化する
    // NAT越えを手助けするユーティリティであるStunサーバ、TURNサーバのURLや認証情報を指定する
    // ローカル環境で試験する場合はSTUN/TURN共に設定せず共繋がるが、練習のためにSkyWayが提供するSTUNサーバを設定してみる
    const pc_config = {"iceServers": [{urls:"stun:stun.skyway.io:3478"}]};
    const peer = new RTCPeerConnection(pc_config);

    // リモートのストリームを受信した場合のイベントをセット
    if ("ontrack" in peer) {
        // Firefox向け
        peer.ontrack = function(event) {
            console.log("-- peer.ontrack()");
            playVideo(remoteVideo, event.streams[0]);
        };
    }
    else {
        // Chrome向け
        peer.onaddstream = function(event) {
            console.log("-- peer.onaddstream()");
            playVideo(remoteVideo, event.stream);
        }
    }

    // ICE Candidateを収集した時のイベント

    // Valilla ICE
    peer.onicecandidate = function (evt) {
        if (evt.candidate) {
            console.log(evt.candidate);
        } else {
            console.log("empty ice event");
            sendSdp(peer.localDescription);
        }
    };

    // // Tricle ICE
    // peer.onicecandidate = function (evt) {
    //     if (evt.candidate) {
    //         // Trickle ICE の場合は、ICE candidateを相手に送る               
    //         console.log(evt.candidate);
    //         sendIceCandidate(evt.candidate);
    //     } else {
    //         // Trickle ICEの場合は何もしない
    //         console.log('empty ice event');
    //     }
    // };

    // ローカルのストリームを利用できるように準備する
    if (localStream) {
        console.log("Adding local stream...");
        peer.addStream(localStream);
    }
    else {
        console.warn("no local stream, but continue.");
    }

    return peer;
}

// 手動シグナリングのための処理を追加する
function sendSdp(sessionDescription) {
    console.log("---sending sdp ---");
    textForSendSdp.value = sessionDescription.sdp;
    textForSendSdp.focus();
    textForSendSdp.onselect();
}

// Connectボタンが押されたら処理を開始
