let agentNumpad, callNotification, secondCallNotification;
const callNotificationElem = document.getElementById('callNotification');
const secondCallNotificationElem = document.getElementById('secondCallNotification');

const callTimeOuter = document.querySelector('#callNotification #call-time');
const callTimer = document.querySelector('#callNotification #call-time span#timer');
const callHoldStatus = document.querySelector('#callNotification #call-time span#hold-status');

const secondCallTimer = document.querySelector('#secondCallNotification #call-time span#timer');

const profileDropDown = document.getElementById("myDropdown");
const profileOnline = document.querySelector(".dropbtn #availability");

let service_app_token = 'MzA3MWQ4NGEtNDA5Ni00MDIwLThkOTctOGZlMmI1N2M1ODk5ZTA0NjAyZDYtNTk5_PF84_ef70fae6-b079-45e6-901e-0a1ba9856721'; // 6100 queue
// let service_app_token = 'YTgyZjkxNTMtM2IzOC00NjYwLTlhMmQtMjk2Y2EzMjUyY2Y2MGFkN2ZkNjAtZTc5_P0A1_b657fcf3-6b06-46a4-ab0e-f23fceb7a447'; //5200 queue
// const refresh_token = 'ZDQzZDE3MjgtYThmNS00NzkwLThhZGMtYjdmYzMxNjAyOTQwZmM1ZGY4NDgtOTU4_PF84_ef70fae6-b079-45e6-901e-0a1ba9856721';

class callNotificationElement {
    constructor(element,callTimerElement){
        this.callNotification = element;
        this.callNotificationTimer = new Timer(callTimerElement);
        this.callNotificationControls = this.callNotification.querySelector('.notifier-a-controls');
        this.callNotificationControls_mute = this.callNotificationControls.querySelector('.mute');
        this.callNotificationControls_hold = this.callNotificationControls.querySelector('.hold');
        this.callNotificationControls_transfer = this.callNotificationControls.querySelector('.transfer');
    }

    toggle(doWhat){
        if(doWhat === "close" || this.callNotification.classList.contains('show-notification')){
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
        this.callNotificationControls_hold.classList.contains('held') ? (
            this.callNotificationControls_hold.classList.remove('held'),
            this.callNotificationControls_hold.dataset.tooltip = "Hold"
        ) : (
            this.callNotificationControls_hold.classList.add('held'),
            this.callNotificationControls_hold.dataset.tooltip = "Resume"
        )
    }

    muteToggle(){
        this.callNotificationControls_mute.classList.contains('muted') ? (
            this.callNotificationControls_mute.classList.remove('muted'),
            this.callNotificationControls_mute.dataset.tooltip = "Mute"
        ) : (
            this.callNotificationControls_mute.classList.add('muted'),
            this.callNotificationControls_mute.dataset.tooltip = "Unmute"
        );
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

// async function refreshGuestToken() {
//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  
//   const urlencoded = new URLSearchParams();
//   urlencoded.append("grant_type", "refresh_token");
//   urlencoded.append("client_id", "C47467d033f61aee5270717f87c571d0989fd9a89d20ebc8180c175daf58882a0");
//   urlencoded.append("client_secret", "db1bcc29eec3503abb619050ec038145fc656d2aeb4ede6fcad8eccbda06c159");
//   urlencoded.append("refresh_token", refresh_token);

//   const request = {
//     method: "POST",
//     headers: myHeaders,
//     body: urlencoded,
//     redirect: "follow"
//   };

//   fetch("https://webexapis.com/v1/access_token", request)
//     .then((response) => response.json())
//     .then((result) => {
//       console.log(result);
//       service_app_token = result.access_token;
//     })
//     .catch((error) => console.error(error));
// }

async function getGuestToken() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${service_app_token}`);

  const raw = JSON.stringify({
    "subject": "Webex Click To Call Demo",
    "displayName": "WebexOne Demo"
  });

  const request = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  const response = await fetch("https://webexapis.com/v1/guests/token", request);
  const data = await response.json();
  
  if (data.accessToken) {
    return data.accessToken;
  }
}

async function getJweToken() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${service_app_token}`);

  const payload =  JSON.stringify({
    "calledNumber": "6100",
    "guestName": "Harvey"
  });

  const request = {
    method: "POST",
    headers: myHeaders,
    body: payload,
    redirect: "follow"
  };
  
  const response = await fetch("https://webexapis.com/v1/telephony/click2call/callToken", request);
  const result = await response.json();
  if (result.callToken) {
    return result.callToken;
  }
}

async function getWebexConfig(userType) {
  // Below values are hardcoded tokens for licensed users
  // let access_token;
  // if (userType === 'customer') {
  //   access_token = "eyJhbGciOiJSUzI1NiJ9.eyJjbHVzdGVyIjoiUDBBMSIsInByaXZhdGUiOiJleUpqZEhraU9pSktWMVFpTENKbGJtTWlPaUpCTVRJNFEwSkRMVWhUTWpVMklpd2lZV3huSWpvaVpHbHlJbjAuLmp1c09mVTI5R18xR3FMWXYxSnAtTHcuUVhadFZMTkJGeHJGV09BcDBCX2FNT3EwdTBWWjZSeXhiUFNMcERqbkZDTWpCd1pjdUNuNDFleWFoUDlGQmF1NHdScmVvMnJiT0N4R2NuVGVVZWhRNzRrVW5YWHpzLVZHbS16X1Zyal9yZU1uaEJQSDlULVllWE85VEFSSnozMWhwWTlEbHQ4aVNUczFpc1lwVF9SWjk5N1M4X3ZuZ3BRX09uNTBlS282MzNjSjNNSl9hRC13c3I1eVpvV2ZsY21ja1NLSUxkRWpXX1JUR25kdkYyYTd2dUNWMjhabTV2M2Rsd1Z1Q3BGeXV6Y2NSUWtWTEFYWktXV1JXU1Z3S21Eci02emxnam1peUVrR3RfSE5XN0dpTTZqVGxZZGVqaHN5RlhwdHZaVWYxcVg0U2w5ejZVYk82MjdhSnVyM21iX1htTVRGenRLZk9ZOWtHSk1rS0ZocEJ4b0NTZVQ2dVVfZ21IZ1FNUFRKOWt3VVVLRU5xZmxHRkVtWHd4UTJEMng1eFB6ZWFScmVtalV4SUV2WUhFV2ZFeDIwend1SDA2N0swWUNCWWdkdUoyWUlIc3FGSnNhQVNNeENxN1ZRMkhyblpOcnpoMERENElYX2xfUVlXZkpFeU1odE1Bek5oSTlOUXJvdkZ2NUR2YUU3M2s1Sm9QV2ZDQmdvNEtKV2Rsa2lLNmwxcUNwdVlWNktvcEQzV2JETENaUDk1OG9DV2FHOUc4c1l0NFRwcGhjX3lyb0F6U0xQcGlLWXNXR196T2E5ZWdTaFBNdS0xaGN6bHNYU01BOUNsZC15Sno3YnBNNktVdW42MndxRGZOTWtuOVBvbzFib0ppUURKWnhUWE5COUlTN0RpVnlqak5HQmhDRDgwWWRkZWlUME9veGRVYUxTX0F0UGhXeU1iVW01anA3OGVNYmdWX2ZPQVZfSjRMbGpGUW5VMEpvbzNybGcxZXpkdG1kZld1SFZNTFpyOVk2TV92WHpjeDBoWE9TaF93Wms4Y0xEZmF5T3NjWHZpNWdHMUxfLU52bXdYRnVyZEFCZHJFRm1WeUx2N3c3OV9xODczb0RkeDNsSndLWS43YzU2MnV2SDQ5LWRhRDRwcTQ5OXRRIiwidXNlcl90eXBlIjoidXNlciIsInRva2VuX2lkIjoiQWFaM3IwWWpJMVl6ZGhZakF0TnpjNU15MDBZelE1TFdKaU1EWXRPVE16T1RWalpUWmlZalExTURJelpEQmtOMlF0TURFeSIsInJlZmVyZW5jZV9pZCI6ImFjY2EyMTUyLThmYjAtNDBmYy05NjQzLTk1NDIyODk5YjEyZiIsImlzcyI6Imh0dHBzOlwvXC9pZGJyb2tlci1iLXVzLndlYmV4LmNvbVwvaWRiIiwidXNlcl9tb2RpZnlfdGltZXN0YW1wIjoiMjAyMzA2MDkxMDAyNDQuMzgyWiIsInJlYWxtIjoiYjY1N2ZjZjMtNmIwNi00NmE0LWFiMGUtZjIzZmNlYjdhNDQ3IiwiY2lzX3V1aWQiOiIwM2NmOWQzNC02ZGE5LTQxNTctYmRlZS1iODg0NzQ3Zjk1Y2IiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiZXhwaXJ5X3RpbWUiOjE3Mjg0MzcyNTI3MjcsImNsaWVudF9pZCI6IkM2NGFiMDQ2MzllZWZlZTQ3OThmNThlN2JjM2ZlMDFkNDcxNjFiZTBkOTdmZjBkMzFlMDQwYTZmZmU2NmQ3ZjBhIn0.TPyBpG7IAhfCrU-QWzPJJi7dWQllvCFhpXFl8YAscuqnbHVdSs-L0AXgDR9WbtOVI1lq7NWS2suJGFIhYrEpAqa90pftx56T5ldK9cnL6TxAVmi9re-S3Eu-2cBAdUVa8GAj84LkLO_3DKKkuijqiRur0uY39ymt9L5Ljay_hAveKJF3MV_YX15b_LKGGCoFgaDBCi8DHUCQiFXQEezB6bNDrTJPH7yteBZvFdEh39mH2XsJ7fK9cJqkuDVCfysSq0aSD_PlyniU2Jf2rYhov5XPWqQjhDBfm3BQksTC7rfOTYBYTnUINOS1H-YRRlT9haleMHkZAKpmKOMyTHn6KQ";
  // }
  // else {
  //   access_token = ""
  // }
 const guestToken = await getGuestToken();
 console.log('Guest token fetch success: ', guestToken);
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
      access_token: guestToken,
    },
  };

  return webexConfig;
} 

async function getCallingConfig() {
    const jweToken = await getJweToken(); 
    console.log('Jwe Token: ', jweToken);

    const clientConfig = {
      calling: true,
      callHistory: true,
    };
  
    const loggerConfig = {
      level: "info",
    };
  
    const serviceData = { indicator: 'guestcalling', domain: '', guestName: 'Harvey'};
  
    const callingClientConfig = {
      logger: loggerConfig,
      discovery: {
        region: "US-EAST",
        country: "US",
      },
      serviceData,
      jwe: `${jweToken}`
    }

    const callingConfig = {
      clientConfig: clientConfig,
      callingClientConfig: callingClientConfig,
      logger: loggerConfig,
    };
  
    return callingConfig;
}

function openCallWindow(num) {
    if (num === '5007') {
        agentNumpad.classList.add('hidden');
        secondCallNotification.toggle();
    } else {
        callNotification.toggle();
    }
}

function openKeypad() {
    agentNumpad = document.getElementById('agent-numpad');
    agentNumpad.classList.contains('show') ? agentNumpad.classList.remove('show') : agentNumpad.classList.add('show');
}

function closeCallWindow() {
    callNotification.toggle("close");
    secondCallNotification.toggle("close");
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
                : "Jane Doe"
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

function updateAvailability(){
    profileOnline.classList.add('online');
}
  
document.querySelector(".dropbtn").addEventListener("click", (event) => {
    if (profileDropDown.classList.contains("show")) {
      profileDropDown.classList.remove("show");
    } else {
      profileDropDown.classList.add("show");
    }
    event.stopPropagation();
});
  
  // Close the dropdown menu if the user clicks outside of it
window.onclick = () => {
    profileDropDown.classList.remove("show");
};

document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggers = document.querySelectorAll('.tooltip-trigger');
    var tooltip = document.querySelector('.tooltip-calling');
  
    tooltipTriggers.forEach(function(trigger) {
      trigger.addEventListener('mouseover', function() {
        var tooltipText = this.getAttribute('data-tooltip');
        tooltip.textContent = tooltipText;
        
        var triggerRect = this.getBoundingClientRect();
        var tooltipRect = tooltip.getBoundingClientRect();
        
        tooltip.style.left = (triggerRect.left + (triggerRect.width - tooltipRect.width) / 2 + 10) + 'px';
        tooltip.style.top = triggerRect.top - tooltipRect.height - 25 + 'px'; // 10px for a little space above the tooltip
        
        tooltip.classList.add('show-tooltip');
      });
  
      trigger.addEventListener('mouseout', function() {
        tooltip.classList.remove('show-tooltip');
      });
    });
});

