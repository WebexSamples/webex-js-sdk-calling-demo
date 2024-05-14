let agentNumpad, callNotification, secondCallNotification;
const callNotificationElem = document.getElementById('callNotification');
const secondCallNotificationElem = document.getElementById('secondCallNotification');

const callTimeOuter = document.querySelector('#callNotification #call-time');
const callTimer = document.querySelector('#callNotification #call-time span#timer');
const callHoldStatus = document.querySelector('#callNotification #call-time span#hold-status');

const secondCallTimer = document.querySelector('#secondCallNotification #call-time span#timer');

const callWindow = document.getElementById('call-window');
const callWindowHeader = document.getElementById('call-window-header');
const callWindowHeaderH1 = callWindowHeader.querySelector('h1');
const callWindowHeaderTimer = new Timer(callWindowHeaderH1);

const callerName = document.getElementById("caller-name");
const callerNumber = document.getElementById("caller-number");
const holdStatus = document.getElementById("hold-status");
const transferSection = document.getElementById("transfer-section");
const transferName = document.getElementById("transfer-name");
const transferNumber = document.getElementById("transfer-number");
const transferBtn = document.getElementById("agent-numpad-trigger");

const profileDropDown = document.getElementById("myDropdown");

class callNotificationElement {
    constructor(element,callTimerElement){
        this.callNotification = element;
        this.callNotificationTimer = new Timer(callTimerElement);
        this.callNotificationControls = this.callNotification.querySelector('.notifier-a-controls');
        this.callNotificationControls_mute = this.callNotificationControls.querySelector('.mute');
        this.callNotificationControls_hold = this.callNotificationControls.querySelector('.hold');
        this.callNotificationControls_transfer = this.callNotificationControls.querySelector('.transfer');
    }

    toggle(){
        if(this.callNotification.classList.contains('show-notification')){
            this.callNotification.classList.remove('show-notification');
            setTimeout(() => { 
                this.callNotification.classList.remove('timestate');
                this.callNotificationTimer.stop();
            }, 2500);
        }
        else{
            this.callNotification.classList.add('show-notification');
        }
        return this.callNotificationTimer;
    }

    startTimer(){
        this.callNotification.classList.add('timestate');
        this.callNotificationTimer.start();
        this.callNotificationControls.classList.remove('hide-controls');
        return this.callNotificationTimer;
    }

    transferToggle(){
        this.callNotification.classList.contains('switch-look') ? this.callNotification.classList.remove('switch-look') : this.callNotification.classList.add('switch-look');
        this.callNotificationControls_transfer.classList.contains('in-progress') ? this.callNotificationControls_transfer.classList.remove('in-progress') : this.callNotificationControls_transfer.classList.add('in-progress');
    }

    holdToggle(){
        callTimeOuter.classList.contains('on-hold') ? callTimeOuter.classList.remove('on-hold') : callTimeOuter.classList.add('on-hold');
        this.callNotificationControls_hold.classList.contains('held') ? this.callNotificationControls_hold.classList.remove('held') : this.callNotificationControls_hold.classList.add('held');
    }

    muteToggle(){
        this.callNotificationControls_mute.classList.contains('muted') ? this.callNotificationControls_mute.classList.remove('muted') : this.callNotificationControls_mute.classList.add('muted');
    }

    enableCompleteTransfer(){
        this.callNotificationControls_transfer.classList.remove('disabled');
    }
}

if(callNotificationElem){
    callNotification = new callNotificationElement(callNotificationElem,callTimer);
}

if(secondCallNotificationElem){
    secondCallNotification = new callNotificationElement(secondCallNotificationElem,secondCallTimer);
}

function fetchCallerBooking() {
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
    access_token = "eyJhbGciOiJSUzI1NiJ9.eyJjbHVzdGVyIjoiUDBBMSIsInByaXZhdGUiOiJleUpqZEhraU9pSktWMVFpTENKbGJtTWlPaUpCTVRJNFEwSkRMVWhUTWpVMklpd2lZV3huSWpvaVpHbHlJbjAuLmZqdG1PR3NvSF90TzFDM1pidmRRMFEuTnJJQ0RObEFXY1kxSHBFOHFVTlNpX1ZBclpCRWhSdzRTZzJ1T19vX3NqeFFKNU5TREV0YzZFNHBGaWFOZXRpczJiMC14Y2ltb1hwUGJwTmswWHFZaVBVaW51YzdRWnlMZnAzT3lqMS1PLXVOTWtjcDJINGFVWFUxTko4RVJueGNaQU5EcnowX0FBNHhwZ1lOQy1BeXJ2WEN2RHFPc1dkXzVZVFVrVGlVczB0dk1BWFlxVTB1dkktNkRsZEF5WU05dFBvNGhiMVR3LWFhNEZVWFRpTmpJZ1Jfb1psLU5rSEFUSmtaVDhFUWRvcHItTHdNeDJoN3VLT1RmR252eWlMd2hncGNkdjFMOEktdkVlUzg3d3l1cEk0R05fU1RfZGU5SXRoYy1Pb2tfaXQ4cXdTazdzb1ZVQmNDVEtTWENlbDkyYk9UTW1OV3M0R0VuMWQwYzNja2xOZzFicURRMmZvVXF0Ml9IOWVvc3BBQlZqOWdPbWcwdTdVRTFNTkM3ZElHYm40MDlJTk1adGlCUXFkTFM4MUt1TmtYODMyYnZZR3RNcmxmUEdrZnRzMGpZV0hTTVhpYU50OW9oa25hQzE3Ri1WTVlyLXl2MmQ5eGt4NS1EdnNsaWhEMGRMOTNMSGdpOVNBaERKRE1jTi15czlYdjV5QTBNNjVDOGh2YjlwVU54WS1UM1lncTVvLWlPVE55LURONmNyRnBmOXRqT0N2N01seGI5X1RPb2d2SDBDaHFYcVJWb0lGd0pMRWxHd0g2VHNiMEF4QzZfQlJ4YVdrQkdzM2hLY0dFTm1WcjJxak1MN0JiLXAtLTFSZE11M29PT3dkZ2E4cEpvNDctS1NLRlkwUnNTTzlBckF0bmoxX1FrN3p5VmJjcTByOVI5bWF4NFdmaXpOMEhpSWVfOC1jRUFyR0tGa3hld3AxNVY3WjM5Rk1jUkE4S2JVT1pmTjl5Z1I2NEd3M3BnRVczcU1mM1ZORF81ZUpkWXZwc29LZHBVbUdod2J3OHF5ZnJVN1VvdnlsdTZjS3lNZ3ZnU2VjWHFVMDh3Xy03LVRCNGZ0Tjd6a0Zuc0w1TzYzSS5zaGxibHA4RC1BbmJDb05LV0xoRERnIiwidXNlcl90eXBlIjoidXNlciIsInRva2VuX2lkIjoiQWFaM3IwWWpVMk1EbGlNbUl0WW1Rd015MDBNakl4TFRnelpqZ3RNbVpoTVdRek5USXdZV1ZoTWpoaFpXRm1aV1V0WW1RMyIsInJlZmVyZW5jZV9pZCI6ImNkNTk4NmQ0LTJjMGQtNGI1MC1hZTc2LWZlMDQwYTUzMzg2MyIsImlzcyI6Imh0dHBzOlwvXC9pZGJyb2tlci1iLXVzLndlYmV4LmNvbVwvaWRiIiwidXNlcl9tb2RpZnlfdGltZXN0YW1wIjoiMjAyMzA1MjYwNzQ2MDAuMTY5WiIsInJlYWxtIjoiYjY1N2ZjZjMtNmIwNi00NmE0LWFiMGUtZjIzZmNlYjdhNDQ3IiwiY2lzX3V1aWQiOiJiNzJiY2FmNi0zZjMwLTQ3YmEtODAzOC0zMzhkOGQwZTU3NzIiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiZXhwaXJ5X3RpbWUiOjE3MTU2NDI5MTE5MjUsImNsaWVudF9pZCI6IkM2NGFiMDQ2MzllZWZlZTQ3OThmNThlN2JjM2ZlMDFkNDcxNjFiZTBkOTdmZjBkMzFlMDQwYTZmZmU2NmQ3ZjBhIn0.dxLIf7XjNJSv5rLjShp2ZL6cUqppVdklUpW55unRZSPmj2oGTlbUGwhbhl5QWtbz6LBBn9Kffmduq63lxyQDEN0HjG-0Tp_jvudCFpBpapMZNz5aEEu63ztFSW_xlpc44ev3bonwqee6MpWpongS8PPLQSI74HRpGcZ2g7u171V77QT-1ZDDlVKKTguHgMDiTqfuV7GgMNJOBzDcUDwAiTWzwGDd137Q7TQVBwFP3V-9N1HnJEWbm9iQnsOjZaUSmuKDCsDzFLIhJnRf5bAIt-ljQ0huBlxrdANQaIynAWgrufmpn70U6R2XwkFrbwbBcAYewft33YqGTasYIp8ZyA";
  } else {
    access_token = 'eyJhbGciOiJSUzI1NiJ9.eyJjbHVzdGVyIjoiUDBBMSIsInByaXZhdGUiOiJleUpqZEhraU9pSktWMVFpTENKbGJtTWlPaUpCTVRJNFEwSkRMVWhUTWpVMklpd2lZV3huSWpvaVpHbHlJbjAuLm9Nc0pKVFRkaW8wbzdZUXlZRWw1YlEuaW5nR2RaZVg3ejlKQ1BiYzFFZmY1NWFiZGM1ZjU5ZFBfd2dKMzJPckVPT0FHbUptUFlMa015Um81allPRTlHYzl3Rm05LUZpYXBzMHV2RWZzS0UyX01DUEF6aGtqeU5tOUc0dU1ERUpEOGlTNGxWbFYydkFyWXlFMDBqOXc4NnpGdmdwZTRUemVTdEd2ZVFBS1lLYzRaLWI5dEJWQkdVeFpENWsydGRWZFlRVlVINzRxMHdwZEwwRjg2a1dsSVBkUW1SVXp6dXZUV1BDLWF1V1RKV2J4WFpzUjF4MGpKTHZleXJxQ1hxSndic1VNaVBIWUpZcm01cnhFUnA5eWN1Yk1Fc0ZPakttQ19TOS15d2tFbnplRGNBOU4xOXllVU5mRXlOY1RlZGZKZUJIODVvWlNTQVQwak9VMTJJWHNQMEFKSl9iX09uOTJLSXczRVA5d2lwX1dSNTZuUVdPV0hJVGlPN0JVSEdpbk9vLVZwSFRxTDV5eFVPXzNNLXd0d19KNEk0LWFaVGlPVjBmRm96dm1SUlFMd2RUbW9za29FWGk2cW96SnBQajE5Yi1OYi14Z3dYLUZpazRSYTBHWEw5alVkMXE3VThBQXNJUXZ1aGVyMTVDdURhZjBmMkwwRWhaYzlPNUtnbHlZUzM3VHdjOW1pWFc5WF9RRTAzTVV1emtqU2JTUzF2T1V0Yk1qZjVYaklmbHdKZ1lhTjlsYVB4Y0NLbHd2MUV4amR5dUtlSzg1T25nTGpqVXktYWxkc1Rxd3E2dTlLTlBlQkg0UEM1SjhzNmdxcGQxbzdVOGNKTFU3QmtqdjdBdWtYZ3hhSXpMRF9jUUw5allxdG5PQjIzYUlZYlFXLW1DMzVwM0xGUEhISmVtZWQ4US00empkaFBCb0FtM0VVMTZWSG9NWGdJdDN5WmJFa0NBWDg2dWpGZG41SnFSd0d2dEN2TUxtYm9xbHhhemdVdllkYVhUNFVsekE3TzhjeGJWWTBSMGJZV2NRSVlya1RNLWpmUUhtRVk0MXJqRFplV2szN3M1eGo3ZDhjMEVVZXJZMlJhNTJna3A0NTlfaGVQRFlyWS45Q0VrWHVWSm83bFk1dFFCTHR6dnJBIiwidXNlcl90eXBlIjoidXNlciIsInRva2VuX2lkIjoiQWFaM3IwTTJWaE9EWTVORFV0TVdJNU1TMDBPVGc1TFdFek9HUXRZalUzTTJJelltSmlOV0prTXpneU5qWXdPVGt0WkdaayIsInJlZmVyZW5jZV9pZCI6ImEzOWQ4MjVmLTA0MmEtNDk3Mi05MzM0LTIwZTY2MWZlY2U5YiIsImlzcyI6Imh0dHBzOlwvXC9pZGJyb2tlci1iLXVzLndlYmV4LmNvbVwvaWRiIiwidXNlcl9tb2RpZnlfdGltZXN0YW1wIjoiMjAyMzA2MDkxMDAyNDQuMzgyWiIsInJlYWxtIjoiYjY1N2ZjZjMtNmIwNi00NmE0LWFiMGUtZjIzZmNlYjdhNDQ3IiwiY2lzX3V1aWQiOiIwM2NmOWQzNC02ZGE5LTQxNTctYmRlZS1iODg0NzQ3Zjk1Y2IiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiZXhwaXJ5X3RpbWUiOjE3MTU2NDYzMjY3NTgsImNsaWVudF9pZCI6IkM2NGFiMDQ2MzllZWZlZTQ3OThmNThlN2JjM2ZlMDFkNDcxNjFiZTBkOTdmZjBkMzFlMDQwYTZmZmU2NmQ3ZjBhIn0.bxwFNWUHIkOZgdf89jW_YzcawqPyITamBKQiTkWnoiqxGgt6xjVqKw-UdPeZr2z9MNRauBuZRDqVH8L-k2_Is4tVM6Th656pNUGYuxLK8ngRj1YzeU2htiSgJhXolTxdeTeeutObsMupQuFeGRlFL4cMl7NcaYUz06ICeL57vRVtxWnqTEUt1Y7ztCD06up396qMbKc8HpL5wqEKEXd0PbE0ZpR3k-AFTDDiXkecpv5m2BJTHQepb_Bu7ASomzo9BeAgpHwUmIdVWkxG9rThQlia0C9tfPJsh_FCJJbtemDv8z19Y-klXRprCPYMSWgs7uC28MJqKf9q5GYKigBUpw';
  }
 
  const webexConfig = {
    config: {
      logger: {
        level: "debug", // set the desired log level
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
      access_token: access_token,
    },
  };

  return webexConfig;
} 

function getCallingConfig() {
    const clientConfig = {
      calling: true,
      callHistory: true,
    };
  
    const loggerConfig = {
      level: "info",
    };
  
    const serviceData = { indicator: "calling", domain: "" };
  
    const callingClientConfig = {
      logger: loggerConfig,
      discovery: {
        region: "",
        country: "",
      },
      serviceData,
    };
  
    const callingConfig = {
      clientConfig: clientConfig,
      callingClientConfig: callingClientConfig,
      logger: loggerConfig,
    };
  
    return callingConfig;
}

function openCallWindow(num) {
    if (num === '5007') {
        // holdStatus.innerText = 'On hold'
        // muteBtn.remove();
        // transferBtn.remove();
        agentNumpad.classList.add('hidden');
        secondCallNotification.toggle();
        // transferSection.classList.remove('hidden');
    } else {
      callWindow.classList.remove("hidden");
    }
}

function openKeypad() {
    agentNumpad = document.getElementById('agent-numpad');
    agentNumpad.classList.contains('show') ? agentNumpad.classList.remove('show') : agentNumpad.classList.add('show');
}

function closeCallWindow() {
    callNotification.toggle();
    // callWindow.classList.add('hidden');
    // callWindowHeaderTimer.stop();
}

function updateCallerId(CallerIdEmitter) {
    if (CallerIdEmitter.callerId.name === 'Priya Kesari') {
        transferName.innerText = 'Jane Doe';
        transferNumber.innerText = '5007';
    } else {
      callerName.innerText = "Benjamin";
      callerNumber.innerText = CallerIdEmitter.callerId.num;
    }
}

  function updateBtnText(btnType) {
    switch (btnType.innerText) {
      case "Mute":
        btnType.innerText = "Unmute";
        break;
      case "Unmute":
        btnType.innerText = "Mute";
        break;
      case "Hold":
        btnType.innerText = "Resume";
        break;
      case "Resume":
        btnType.innerText = "Hold";
        break;
      default:
        console.log("No case matched");
    }
  }
  
  function renderCallHistoryItem(call) {
    const avatarInitial = "Harvey Specter".charAt(0).toUpperCase();
    const directionIcon =
      call.direction === "OUTGOING" ? "fa-arrow-up" : "fa-arrow-down";
    const callDate = new Date(call.startTime).toLocaleDateString();
  
    return `
        <div class="call-history-item">
          <div class="call-avatar">${avatarInitial}</div>
          <div class="call-details">
            <div class="call-name">${
              call.other.name === "Priya Kesari"
                ? "Harvey Specter"
                : "Harvey Specter"
            }</div>
            <div class="call-phone">${call.other.phoneNumber}</div>
          </div>
          <div class="call-indicator">
            <div class="call-date">${callDate}</div>
            <i class="fas ${directionIcon}" style="transform: rotate(45deg);"></i>
          </div>
          <div class="make-call">
              <button class="attend-call-btn"><i class="fa fa-phone" aria-hidden="true" style="transform: rotateZ(90deg);"></i></button>
          </div>
        </div>
      `;
  }
  
  function showHideCallHistory() {
    var container = document.querySelectorAll(".call-history-container")[0];
  
    if (container.classList.contains("visible")) {
      container.classList.remove("visible");
      container.style.height = "40px";
    } else {
      container.classList.add("visible");
      container.style.height = "30rem";
    }
  }
  
  function renderCallHistory(callHistoryData) {
    const callHistoryList = document.getElementById("callHistoryList");
    let callHistoryHTMLHeader = `
          <div id = "call-history-header" class="call-history-header" onclick="showHideCallHistory()">
              Call History
              <img src="../images/unfold.png" alt="" style="    margin-left: 180px;height: 20px;cursor: pointer;">
          </div>
      `;
    let callHistoryHTML = callHistoryData.map(renderCallHistoryItem).join("");
    callHistoryList.innerHTML = callHistoryHTMLHeader + callHistoryHTML;
    callHistoryList.classList.add("show-history");
  }
  
  document.querySelector(".dropbtn").addEventListener("click", (event) => {
    if (profileDropDown.classList.contains("show")) {
      profileDropDown.classList.remove("show");
    } else {
      profileDropDown.classList.add("show");
    }
    event.stopPropagation();
  });
  function removeBlur() {
    document.getElementById("body").style.filter = "brightness(1)";
    document.getElementById("body-header").style.filter = "brightness(1)";
    try {
      document.getElementById("callHistoryList").style.filter = "brightness(1)";
    } catch (err) {
      console.log("DEMO: No Call history");
    }
  }
  
  function addBlur() {
    document.getElementById("body").style.filter = "brightness(0.5)";
    document.getElementById("body-header").style.filter = "brightness(0.5)";
    try {
      document.getElementById("callHistoryList").style.filter = "brightness(0.5)";
    } catch (err) {
      console.log("DEMO: No Call history");
    }
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = () => {
    profileDropDown.classList.remove("show");
  };