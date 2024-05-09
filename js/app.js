let agentNumpad;
const callNotification = document.getElementById('callNotification');
const callTime = document.getElementById('call-time');
const callWindow = document.getElementById('call-window');
const callWindowHeader = document.getElementById('call-window-header');
const callWindowBody = document.getElementById('call-window-body')
const callWindowFooter = document.getElementById('call-window-footer');

let timer = {
    minutes: 0,
    seconds: 0,
    interval: null,
    start: () => {
        timer.interval = setInterval(() => {
            timer.seconds++;
            if(timer.seconds === 60){
                timer.seconds = 0;
                timer.minutes++;
            }
            callTime.innerHTML = `${timer.minutes < 10 ? '0' + timer.minutes : timer.minutes}:${timer.seconds < 10 ? '0' + timer.seconds : timer.seconds}`;
        }, 1000);
    },
    pause: () => {
        clearInterval(timer.interval);
    },
    continue: () => {
        timer.start();
    },
    stop: () => {
        clearInterval(timer.interval);
        timer.minutes = 0;
        timer.seconds = 0;
        callTime.innerHTML = '00:01';
    },
}

callNotification.__proto__.toggle = () => {
    if(callNotification.classList.contains('show-notification')){
        callNotification.classList.remove('show-notification');
        setTimeout(() => { 
            callNotification.classList.remove('timestate');
            timer.stop();
        }, 2500);
    }
    else{
        callNotification.classList.add('show-notification');
    }
    return timer;
}

callNotification.__proto__.startTimer = () => {
    callNotification.classList.contains('timestate') ? callNotification.classList.remove('timestate') : callNotification.classList.add('timestate');
    timer.start();
}

window.onload = () => {
    const agentNumpadTrigger = document.getElementById('agent-numpad-trigger');
    agentNumpad = document.getElementById('agent-numpad');
    agentNumpadTrigger.addEventListener('click', () => 
        agentNumpad.classList.contains('show') ? agentNumpad.classList.remove('show') : agentNumpad.classList.add('show')
    );
}

function swapDivs() {
    var mikeross = document.getElementsByClassName('hider-mikeross');
    var harveyspecter = document.getElementsByClassName('hider-harveyspecter');
    for (var i = 0; i < mikeross.length; i++) {
        mikeross[i].style.display = 'none';
    }
    for (var i = 0; i < harveyspecter.length; i++) {
        harveyspecter[i].style.display = 'block';
    }
}

function getAccessToken(userType) {
    let access_token;
    if (userType === 'customer') {
        access_token = 'OGY4OTgzOGUtNGUzNS00MmQ5LWJkNTEtMDUyODBmMTBhY2U0NTNkM2Q2ODQtZjAx_P0A1_b657fcf3-6b06-46a4-ab0e-f23fceb7a447';
        customerLoginBtn.remove();
    } else {
        access_token = 'NTRjMmFmYmQtOTJmNi00NTQ4LWI5ZDMtZDU4YjRjY2Q1Nzk2MjIxOThkMzktOTAx_P0A1_b657fcf3-6b06-46a4-ab0e-f23fceb7a447';
    }

    return access_token;
}

function openCallWindow() {
    callWindow.classList.add('call-window');
    callWindowHeader.classList.add('call-window-header');
    callWindowBody.classList.add('call-window-body');
    callWindowFooter.classList.add('call-window-footer');
}

function closeCallWindow() {
    callWindow.classList.remove('call-window');
    callWindowHeader.classList.remove('call-window-header');
    callWindowBody.classList.remove('call-window-body');
    callWindowFooter.classList.remove('call-window-footer');
}

function renderCallHistoryItem(call) {
    const avatarInitial = call.other.name.charAt(0).toUpperCase();
    const directionIcon = call.direction === 'OUTGOING' ? 'fa-arrow-up' : 'fa-arrow-down';
    const callDate = new Date(call.startTime).toLocaleDateString();
    const callTime = new Date(call.startTime).toLocaleTimeString();

    return `
      <div class="call-history-item">
        <div class="call-avatar">${avatarInitial}</div>
        <div class="call-details">
          <div class="call-name">${call.other.name}</div>
          <div class="call-phone">${call.other.phoneNumber}</div>
        </div>
        <div class="call-indicator">
          <div class="call-date">${callDate}</div>
          <i class="fas ${directionIcon}"></i>
        </div>
        <div class="make-call">
            <button class="attend-call-btn"><i class="fas fa-phone"></i></button>
        </div>
      </div>
    `;
}

function renderCallHistory(callHistoryData) {
    const callHistoryList = document.getElementById('callHistoryList');
    let callHistoryHTMLHeader = `
        <div class="call-history-header">
            Call History
        </div>
    `
    let callHistoryHTML = callHistoryData.map(renderCallHistoryItem).join('');
    callHistoryList.innerHTML = callHistoryHTMLHeader+callHistoryHTML;
    callHistoryList.classList.add('show-history');
}
