let agentNumpad;
const callNotification = document.getElementById('callNotification');
const callTime = document.getElementById('call-time');
const callWindow = document.getElementById('call-window');
const callWindowHeader = document.getElementById('call-window-header');
const callWindowHeaderH1 = callWindowHeader.querySelector('h1');
const callWindowHeaderTimer = new Timer(callWindowHeaderH1);

const callerName = document.getElementById('caller-name');
const callerNumber = document.getElementById('caller-number');
const holdStatus = document.getElementById('hold-status');
const transferSection = document.getElementById('transfer-section');
const transferName = document.getElementById('transfer-name');
const transferNumber = document.getElementById('transfer-number');
const transferBtn = document.getElementById('agent-numpad-trigger');

const profileDropDown = document.getElementById("myDropdown");

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

if(callNotification){
    const callNotificationTimer = new Timer(callTime);
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
        return callNotificationTimer;
    }

    callNotification.__proto__.startTimer = () => {
        callNotification.classList.contains('timestate') ? callNotification.classList.remove('timestate') : callNotification.classList.add('timestate');
        callNotificationTimer.start();
        return callNotificationTimer;
    }
}

function openKeypad() {
    agentNumpad = document.getElementById('agent-numpad');
    agentNumpad.classList.contains('show') ? agentNumpad.classList.remove('show') : agentNumpad.classList.add('show');
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
    } else {
        access_token = 'NTRjMmFmYmQtOTJmNi00NTQ4LWI5ZDMtZDU4YjRjY2Q1Nzk2MjIxOThkMzktOTAx_P0A1_b657fcf3-6b06-46a4-ab0e-f23fceb7a447';
    }

    return access_token;
}

function openCallWindow(num) {
    if (num === '5007') {
        holdStatus.innerText = 'On hold'
        muteBtn.remove();
        transferBtn.remove();
        agentNumpad.classList.add('hidden');
        transferSection.classList.remove('hidden');
    } else {
        callWindow.classList.remove('hidden');
    }
}

function closeCallWindow() {   
    callWindow.classList.add('hidden');
    transferSection.classList.remove('hidden');
}

function updateCallerId(CallerIdEmitter) {
    if (CallerIdEmitter.callerId.name === 'Priya Kesari') {
        transferName.innerText = 'Jane Doe';
        transferNumber.innerText = '5007';
    } else {
        callerName.innerText = 'Benjamin';
        callerNumber.innerText = CallerIdEmitter.callerId.num;
    }
}

function updateBtnText(btnType) {
    switch(btnType.innerText) {
        case 'Mute':
            btnType.innerText = 'Unmute';
            break;
        case 'Unmute':
            btnType.innerText = 'Mute';
            break;
        case 'Hold':
            btnType.innerText = 'Resume';
            break;
        case 'Resume':
            btnType.innerText = 'Hold';
            break;
        default:
            console.log('No case matched');
    }
}

function renderCallHistoryItem(call) {
    const avatarInitial = 'Harvey Specter'.charAt(0).toUpperCase();
    const directionIcon = call.direction === 'OUTGOING' ? 'fa-arrow-up' : 'fa-arrow-down';
    const callDate = new Date(call.startTime).toLocaleDateString();
    const callTime = new Date(call.startTime).toLocaleTimeString();

    return `
      <div class="call-history-item">
        <div class="call-avatar">${avatarInitial}</div>
        <div class="call-details">
          <div class="call-name">${call.other.name==='Priya Kesari'?'Harvey Specter':'Harvey Specter' }</div>
          <div class="call-phone">${call.other.phoneNumber}</div>
        </div>
        <div class="call-indicator">
          <div class="call-date">${callDate}</div>
          <i class="fas ${directionIcon}"></i>
        </div>
        <div class="make-call">
            <button class="attend-call-btn"><i class="fa fa-phone" aria-hidden="true" style="transform: rotateZ(103deg);"></i></button>
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

document.querySelector('.dropbtn').addEventListener('click', (event) => {
    if (profileDropDown.classList.contains('show')) {
        profileDropDown.classList.remove('show');
    }
    else{
        profileDropDown.classList.add('show');
    }
    event.stopPropagation();
});
  
  // Close the dropdown menu if the user clicks outside of it
window.onclick = () => {
    profileDropDown.classList.remove('show');
}