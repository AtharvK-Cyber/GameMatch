document.addEventListener('DOMContentLoaded', () => {
    const video1 = document.querySelector('#video1 video');
    const video2 = document.querySelector('#video2 video');
    const muteButton = document.getElementById('muteButton');
    const videoButton = document.getElementById('videoButton');
    const chatContent = document.getElementById('chatContent');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const user2Label = document.getElementById('user2Label');

    let localStream;
    let isMuted = false;
    let isVideoOff = false;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            video1.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });

    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        localStream.getAudioTracks()[0].enabled = !isMuted;
        muteButton.innerHTML = isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
    });

    videoButton.addEventListener('click', () => {
        isVideoOff = !isVideoOff;
        localStream.getVideoTracks()[0].enabled = !isVideoOff;
        videoButton.innerHTML = isVideoOff ? '<i class="fas fa-video-slash"></i>' : '<i class="fas fa-video"></i>';
    });

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessageToChat(message, 'user');
            messageInput.value = '';
        }
    }

    function addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble');
        messageElement.classList.add(sender + '-message');
        messageElement.textContent = message;
        chatContent.appendChild(messageElement);
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    function simulateUserConnected() {
        user2Label.textContent = "Connected Player"; 
    }

    setTimeout(simulateUserConnected, 2000); 
});
