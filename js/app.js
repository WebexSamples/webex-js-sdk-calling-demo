let agentNumpad, callNotification, secondCallNotification;
const callNotificationElem = document.getElementById('callNotification');
const secondCallNotificationElem = document.getElementById('secondCallNotification');

const callTimeOuter = document.querySelector('#callNotification #call-time');
const callTimer = document.querySelector('#callNotification #call-time span#timer');
const callHoldStatus = document.querySelector('#callNotification #call-time span#hold-status');

const secondCallTimer = document.querySelector('#secondCallNotification #call-time span#timer');

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
    access_token = "eyJhbGciOiJSUzI1NiJ9.eyJjbHVzdGVyIjoiUDBBMSIsInByaXZhdGUiOiJleUpqZEhraU9pSktWMVFpTENKbGJtTWlPaUpCTVRJNFEwSkRMVWhUTWpVMklpd2lZV3huSWpvaVpHbHlJbjAuLmdHRjFiZ0VYSTFRdUJFX2JKbUp4UmcuaHJmWUd5cEpMeDdERVBTdW9uWHFrdVkwSkhyNFIydURIVDNZaWlEVnQxWU9JOTNTSklRN3dBcmQ4RVZLN2dWSXBxRDd2ODI5QmRXb21DZGhhVUFhQ1RSdm9uNGZlV2NEOVRLb055TmUxeXZ3UFRiQmVJdFhONTZ2bVpCSmFqNGJFX0VuUW9QZFBaZzB4NVRBVmJ5c0VGdFlPMHNGMV9KckEyYzJqcVRBa0NQLVpGTndUV2ctTG9adU9DWHphUVIyeWdxc3hlZ2QyVWNRanRDc0N0MGN1cFMwalR1Si1YQXRySUZDT1RiQVNCNUxTaUJlNjkzV01DbjgySmpXSmJ1RF96eG9TT3QxQUU4eXVMdGhEdWx6UWxneDgxY1Z1dGZPWWxqdU9XN0k0dDYtdzMyMmdZUFpseEF4azhoc0dGLUV1ZU81TGQyX0k3QUNmTmZma3BiZzR5U2s4d05PWVo3a29pZ1dQWnQtSDNXTGNLQmhoeWxfYm9kWW1WMnJ1WVRQeU1mNE1mRmtQaWgzZEVZUFFhX252ZHFaSWhjeHhvS1FROW95NW5IZ3dsWnktZ2RtZDhxenpvenZUSUJzQ3Q1TmxMWVVVVjB5azFBQUFwSzlWNTYzTzcxSlFERV9IbC1UcF9UY3ZzNTZQMmt4elZKekJlazQ5NXNULXdiamdleUROQThsTlZHNFl2R1Y5MWdJRDRtY1VaZkZ0LTJwcFR1OVZJa0taWWxlQUxOOW9HcDVUZjJPQ0JpeEpfQWp6dmcyNFY4SWJWVzFvLVBMWDhLYTlHZy16Y1lVcFRXV3BqZERxb3NUUUUzX2owR2hFTk1BVDhzWFBuZFVGYmRkQzhQb0xuR0RYejE4Um5Zd2dLZzl4amRacTRKeE84b3FvVDhiMUFyeTA4TEZ2R05jcHJjU0ZiTDNLc3VqQUh5bEpPNWdCWEZDNHVkMUwyZHpEWGR5QzYtZk4tR3pCUEZZMVRxSGxldDc3ZGpFYVVxNkdRekpOa21pWVZpcmdwdnBfX0xVcWFnSWVCaVA5UlRCR1R2RW1LcUJlcUlJaU5BTGFmYm54Tlh3QUQ3SV9Bby5rbnpjbURKOEJJdS1pa3dvY01HeXVRIiwidXNlcl90eXBlIjoidXNlciIsInRva2VuX2lkIjoiQWFaM3IwTVdWbFl6bGpaalV0TVdWaE9TMDBZakZoTFRoaU1qWXRZekEyWW1JNE5qaGtNVEJtTkdOa01qSmhNRE10Wm1VMyIsInJlZmVyZW5jZV9pZCI6IjBjOTE3MmU0LTFhMjgtNGMzNC04ZmI4LTRhZGFjMzdiZDhhYiIsImlzcyI6Imh0dHBzOlwvXC9pZGJyb2tlci1iLXVzLndlYmV4LmNvbVwvaWRiIiwidXNlcl9tb2RpZnlfdGltZXN0YW1wIjoiMjAyMzA1MjYwNzQ2MDAuMTY5WiIsInJlYWxtIjoiYjY1N2ZjZjMtNmIwNi00NmE0LWFiMGUtZjIzZmNlYjdhNDQ3IiwiY2lzX3V1aWQiOiJiNzJiY2FmNi0zZjMwLTQ3YmEtODAzOC0zMzhkOGQwZTU3NzIiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiZXhwaXJ5X3RpbWUiOjE3MTU4MDkwNTI4MzcsImNsaWVudF9pZCI6IkM2NGFiMDQ2MzllZWZlZTQ3OThmNThlN2JjM2ZlMDFkNDcxNjFiZTBkOTdmZjBkMzFlMDQwYTZmZmU2NmQ3ZjBhIn0.PP_W4FjXPSTbLP2FJJ5Z1z59dQ1WIiZlQtKnW3V4giKJsHI6vxRyPZNArYxq0a1cWSrw2gi_UPRQH62PnztQLMsdHQ1ONVPBWtudkpOkiui1BNSca6Uyu3u2IEYt3Qvyer7wI5P2PDbkqkLlJ52Wh4G-BDYyxGJKgOTxtoAKLIbL8_BHWBCdkYGWi_APJYzkZhkYsBc_KksdMow92wGnCQnqNvs4wVn0ApzrUOtAVZZT-nIiA181oPmL5Tk7royyFlyH3csuR9hDb-G-u8KKszs5TqFF9_YbcKN7iXyUnXOM8OQ_kPDnuu4wenyTN_yUO4CZ5vlQo_9BP1AkZ7wGkQ";
  } else {
    access_token = 'eyJhbGciOiJSUzI1NiJ9.eyJjbHVzdGVyIjoiUDBBMSIsInByaXZhdGUiOiJleUpqZEhraU9pSktWMVFpTENKbGJtTWlPaUpCTVRJNFEwSkRMVWhUTWpVMklpd2lZV3huSWpvaVpHbHlJbjAuLlFoMzdWRW1PN05mVGhUdnVrRnpHUWcuelNkejVid1UxZlhwZkkxQU1xZUlMc1FuV2ZhYjQ4ZHp4NGc1TTNKaGtfblJtbUZpcXRJTjBmLUItYzBWWERmUmZ1VUt6T25NTU1iVWFHaXVqR1lJZUJnZmhUR0h2MVlNd01KdUxKeTJfTXRINm1HR1hZN3Z5TjR3UFFsMHBqSUVEMVplZkd2enRsUkFoVmhPdVRIM2FvZ2xwbG50YlJwWFJSYzA5a0dNRnh6ZldhbnZKRXBXalhwMlBKN3FtRU1YYlBpdkF4dF82Z3F6dGwweXZfdDV6MGkxOWRvTlhUX2hfUWp6djdCa0gtOXpKSENrRjZ4TWw3MnNSRGR6WmtyOTVyOXZnVjhuSVRqelFvQzA1SElPNk5Xb20tbnFYdzNENXVoRDc2T05jeU9LVTJwTE5pSkpPUDdvZ25TVERCX0tuQXRRT29GSHVDT0ptN1pNYWkwZUJyajRGNnZpUlZRbkJ0ZlZGTjBtaTRBY3BFWVlTS3ZYeHVpZVNzWXNna1p3QWRSVUU5eHl1RFpfMFVESlRfdjNfTkZNMUs3NzJNOEpCcUNPSzVVVXR4M2I2LTZqa1dWRUpPZkFkSmNGb05DeWdzV25PcnZ1UHRhWWFCdmI3Zl8xWm5MVUdLZjh1SXhDa1BQaC1fRVZwRlliSlpJSFNMbVFpSFAzc1FjUFFLcnkwQlFESFg5XzlCeXRWRkhvdmp0eVI3VVhfUmkxNHA1ellIcXlfOThVTXFKTWVmV3hHX1Y5UzBOc3ZqZmFMUkFXSTdGME5sN0dMVmVhaGhFZmdZN0xMWXFwV1NJTWZpbmlTc2k0WG5oRGNPWU9vNmFSR2RCSW9Ia3pIcGxYa0ZrT3NhcFpXM1NkNmp1UFV0TXlZNmljaTFKOGd3eEs5V016VTRMT2h5NHBQRXlvUjdnRTJkRGs1UXJpbmoxVkp0ZWpmbC1Xemw2V3AySlZuV3FmV05yQjVuT2QzU1hkZUQ5cVFOUGF5RDFjSThVTmlUZU81R0x2UzA0NmFxS0FuV3ZENFBTeThDUzlvNFVfZkdmbTB6Rm1aRDVzUXhxRzloVlhaQ0drUGI0eXJKZy5jeGE4bFZTRC1DUGVvVGpBZG9ja2V3IiwidXNlcl90eXBlIjoidXNlciIsInRva2VuX2lkIjoiQWFaM3IwTkRVellqSmtPV010WmpKaE15MDBNemM0TFdFeFpXUXRPVGd4TVdJeE1tSm1NMkU0TXpCalpqRXdORGt0TVRBeSIsInJlZmVyZW5jZV9pZCI6ImI5MTA0ZWFiLWFhNWEtNDI4MC04MjAxLTRhYWE3YzcxYjhkOSIsImlzcyI6Imh0dHBzOlwvXC9pZGJyb2tlci1iLXVzLndlYmV4LmNvbVwvaWRiIiwidXNlcl9tb2RpZnlfdGltZXN0YW1wIjoiMjAyMzA2MDkxMDAyNDQuMzgyWiIsInJlYWxtIjoiYjY1N2ZjZjMtNmIwNi00NmE0LWFiMGUtZjIzZmNlYjdhNDQ3IiwiY2lzX3V1aWQiOiIwM2NmOWQzNC02ZGE5LTQxNTctYmRlZS1iODg0NzQ3Zjk1Y2IiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiZXhwaXJ5X3RpbWUiOjE3MTU4MDg5NjAyOTMsImNsaWVudF9pZCI6IkM2NGFiMDQ2MzllZWZlZTQ3OThmNThlN2JjM2ZlMDFkNDcxNjFiZTBkOTdmZjBkMzFlMDQwYTZmZmU2NmQ3ZjBhIn0.aJ_JzMqlSSA8s3IGU8_R-FPmVFmvbqkwUNOIR6o-gc9l6IkNPaczsyfjGvovkAtmHISPJRNxnq0Qfgam9fCKkDPwJH173uN1jNkm_baJ7qmin-1SrCKazM1xzfxNdv5FABO6kZEa1RBcF0238-soJ5Dbc-bVEsNZHNSX0rklKJLh6ediY2Fs1Bk4hhlkrgLf_ZPJslOVO_DaG2t6lnHA6x_ohwMbZKL9LZNrkhu7UDGdu5UnmjpYnCtUNZb2zjRm9R2iNxXiwobGaVpKea_84FvhNUvmI2yhqu1Itz8zQNxQHbT7QSRLS1uZpGR9-2T_x6Ra2OItoJ1Rza2vcnm04w';
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
  
  // Close the dropdown menu if the user clicks outside of it
window.onclick = () => {
    profileDropDown.classList.remove("show");
};