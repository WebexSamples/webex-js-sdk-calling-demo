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

function openCallNotification(callObj) {
    callNotification.toggle();
    callNotifyEvent.detail.callObject = callObj;
}

function getWebexConfig(userType) {
    let access_token;
    if (userType === 'customer') {
        access_token = "eyJhbGciOiJSUzI1NiJ9.eyJjbHVzdGVyIjoiUDBBMSIsInByaXZhdGUiOiJleUpqZEhraU9pSktWMVFpTENKbGJtTWlPaUpCTVRJNFEwSkRMVWhUTWpVMklpd2lZV3huSWpvaVpHbHlJbjAuLjVCWVh3VzUzQUwwMVFLQkNyMXNuS1EuRjYxbGNLRG9ma0ItNkxRNWNOSEM3ZkswWHB0NEJ1N19yYVByOFFHSzM2ZUVKbVJWSTlSSTJJU0htMWVPLWtEek54cVNFdFJMdTBIek9HM3MwV3ViZFRYTGdUSXA4aHBlWVRlOWtid3BONzEwbURzRllJWTJURXhBYXU5OTBrZDdheTlCUFpOUk16OHJEeWFtMW1TbDRNNnM5eXFKM1VlbGxBbjFscUp2YkVhUU94UmRpeEhUbFNPVExYekg3dGZYbTFjM1NtRS1sbkk4ZGFZZzVZd1NQQ0Z6SnpIMU03TkhodXhBR3V6c19naEFNZ3BMdUE5eHptQmNyU2lKWGZOQ2xsLXN3Z0c2bkpnc1BGM0QtM2Y3ai1WMmlhc0RHSGZxS2pxM2RuT25GdHJjRUtDRDlLaXgtY3lTX0xTMmVsXzRuR3BZeHMxTVZhbWlFNEFKZk1mU2F5N2lGcl83V3FPcktDbUFsLWlBdkRFRU9JdUx5ZlNUVlZfbHlmdW84anZVVXh3Vmd6OE9kYVVFb3EtTUI5WGFtdWNPdGVHTmd6YnROaldMS1AxMTZ5NlNYUHNISGpWRkRrUGRDM1BvS2t0SEVPYmw0dHlOSU54am5VTllnLTd6RlpEb2hIcEpLQzBNeTNlMzJZblRrNHdfUVU2SktqVHJxS3dWdURPcTZFb1dOSnNJQi1rUDJQcDFvWWdqak1pd2RzaXhYTGhURF8zMjVDLXYwT1diaF95cmxaOWZWVzdZTWFydWNtMkhJNUNRcE5OUV9OajFhbVBzZ0NqSFFrekNoMEw5NThuYU9IbVJkNF8zakd3WlZQc01MaHptVVFzMkVOel9uZUNtOVIzejVJelVrN0ZoQm96UEdYWWZscjQ4X25hSjJQa2p1UzhkQWNUcXdHcEdDNUNmeXNmelFEbGM4OHNFaWZLbDkwRzBXYzZJeGN3bkREdGFlU1RyU1Jjem9ZUE92aDVwYlRlSl9Dc09iRVNHLWRhX0xzUVBjV29NcjNERmVBUjVIeUNxeGR2QUJKdGdTamFGVkpRTXZrVjhoWk5weWNrSHpOcF9xZkwwZkE2U0xFZy5XWTE4R3FwVFMtZWQxdTQ2UWMzX3ZBIiwidXNlcl90eXBlIjoidXNlciIsInRva2VuX2lkIjoiQWFaM3IwTW1Oa1kyUXhZV1F0TkRNek5DMDBNalV6TFRrd05qSXROMkUxWXpWaU5qbGhOMlZtWVRNNU1tSTFaak10T1RVeSIsInJlZmVyZW5jZV9pZCI6IjVhZTVkNjlkLWNlYTMtNDhmNy05MzhhLTRjZmE2YjNhMTkwMyIsImlzcyI6Imh0dHBzOlwvXC9pZGJyb2tlci1iLXVzLndlYmV4LmNvbVwvaWRiIiwidXNlcl9tb2RpZnlfdGltZXN0YW1wIjoiMjAyMzA1MjYwNzQ2MDAuMTY5WiIsInJlYWxtIjoiYjY1N2ZjZjMtNmIwNi00NmE0LWFiMGUtZjIzZmNlYjdhNDQ3IiwiY2lzX3V1aWQiOiJiNzJiY2FmNi0zZjMwLTQ3YmEtODAzOC0zMzhkOGQwZTU3NzIiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiZXhwaXJ5X3RpbWUiOjE3MTU1MDkzNjc4OTQsImNsaWVudF9pZCI6IkM2NGFiMDQ2MzllZWZlZTQ3OThmNThlN2JjM2ZlMDFkNDcxNjFiZTBkOTdmZjBkMzFlMDQwYTZmZmU2NmQ3ZjBhIn0.SXbrvv69e15Xdcrv2Mzn0pidc55AZsIGJCdbcJAZTKlB2BA9Q4FIDVu1I2gObcfEh0A4bSzJaR4RmLQIXHWLxB17gsp6G29IuP-HnaLA_IQXG-cPhE8HP2zjUJ08nvVTl-A2MTF7z4iy3_dOT4qLafgQEPTzdTBdmkJ30jZ6rNPrk2bcFCiom1ycscvS0yrE_QM_oWmsDrZoy-qvLB248Uzm8xh_7KqR_zC3qwpsJii4KTvPWO40lrRzl77bNvK_qvg9vePoNnPYoQcZnVIbveWrD4WEE-Z8DefsQMZVtah1d8do9a5P6IZIhKfESOm4aB0x8jzQkJQ_5GPbjnrq8g";
    } else {
        access_token = 'NTRjMmFmYmQtOTJmNi00NTQ4LWI5ZDMtZDU4YjRjY2Q1Nzk2MjIxOThkMzktOTAx_P0A1_b657fcf3-6b06-46a4-ab0e-f23fceb7a447';
    }

    const webexConfig = {
        config: {
            logger: {
                level: 'debug', // set the desired log level
            },
            meetings: {
                reconnection: {
                    enabled: true,
                },
                enableRtx: true,
            },
            encryption: {
                kmsInitialTimeout: 8000,
                kmsMaxTimeout: 40000,
                batcherMaxCalls: 30,
                caroots: null,
            },
            dss: {},
        },
        credentials: {
            access_token: access_token
        }
    };

    return webexConfig;
}

function getCallingConfig() {
    const clientConfig = {
        calling: true,
        callHistory: true,
    }

    const loggerConfig = {
        level: 'info'
    }

    const serviceData = {indicator: 'calling', domain: ''};

    const callingClientConfig = {
        logger: loggerConfig,
        discovery: {
            region: '',
            country: '',
        },
        serviceData,
    };

    const callingConfig = {
        clientConfig: clientConfig,
        callingClientConfig: callingClientConfig,
        logger: loggerConfig
    }

    return callingConfig;
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

function openKeypad() {
    agentNumpad = document.getElementById('agent-numpad');
    agentNumpad.classList.contains('show') ? agentNumpad.classList.remove('show') : agentNumpad.classList.add('show');
}

function closeCallWindow() {
    callWindow.classList.add('hidden');
    callWindowHeaderTimer.stop();
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