
// Globals
let calling;
let callingClient;
let correlationId;
let callHistory;
let line;
let call;
let incomingCall;
let localAudioStream;

const accessToken = 'ZTAwYjFlMGUtYzViMC00OGFjLWJmZmMtYmM0MGY0YTU4MTVkOTcwZDczNjktNmU2_A52D_1704d30d-a131-4bc7-9449-948487643793'

let access_token;

// Create the Webex configuration
// authentication 
const agentLoginBtn = document.querySelector('#agent-login-btn');
const customerLoginBtn = document.querySelector('#customer-login-btn');
const loaderWrapperBtn1 = document.querySelector('#customer-loader-wrapper');
const loaderWrapperBtn2 = document.querySelector('#agent-loader-wrapper');
const makeCallBtn = document.querySelector('.call-support-btn');
const callWindow = document.getElementById('customer-call-window');
const callWindowHeader = document.getElementById('call-window-header');
const callWindowBody = document.getElementById('call-window-body')
const callWindowFooter = document.getElementById('call-window-footer');
const callerName = document.getElementById('caller-name');
const callerNumber = document.getElementById('caller-number');

async function initCalling(userType) {
    if (userType === 'customer') {
        access_token = 'ZGE1OTZlYmQtOTZjNy00NWJlLThkMzUtZWY1OWE3ZmEwZGRmMmNlYTVlNTMtNWI3_P0A1_b657fcf3-6b06-46a4-ab0e-f23fceb7a447';
        loaderWrapperBtn1.classList.add('customer-loader-wrapper');
    } else {
        access_token = 'NTRjMmFmYmQtOTJmNi00NTQ4LWI5ZDMtZDU4YjRjY2Q1Nzk2MjIxOThkMzktOTAx_P0A1_b657fcf3-6b06-46a4-ab0e-f23fceb7a447';
        loaderWrapperBtn2.classList.add('agent-loader-wrapper');
    }
    console.log('Authentication#initWebex()');
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
    // right now we are doing it with INT ENV
    // let enableProd = false;
    // if (!enableProd) {
    //     webexConfig.config.services = {
    //         discovery: {
    //             u2c: 'https://u2c-intb.ciscospark.com/u2c/api/v1',
    //             hydra: 'https://apialpha.ciscospark.com/v1/',
    //         },
    //     };
    // }

    const clientConfig = {
        calling: true,
        callHistory: true,
        callSettings: true,
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

    // Create the Calling object
    calling = await Calling.init({ webexConfig, callingConfig });

    calling.on('ready', () => {
        console.log('Authentication :: Calling Ready');

        calling.register().then(async () => {

            callingClient = window.callingClient = calling.callingClient;

            line = Object.values(callingClient?.getLines())[0];
            registerLine(userType);
            if (userType === 'agent') {
                if (window.callHistory === undefined) {
                    callHistory = window.callHistory = calling.callHistoryClient;
                    callHistory.on('callHistory:user_recent_sessions', (sessionData) => {
                        console.log('Users recent session data : ', sessionData.data.userSessions.userSessions[0]);
                    });
                
                    const numberOfDays = 7,
                    callHistoryLimit = 20,
                    callHistorySort = 'ASC',
                    callHistorySortBy = 'startTime';
                
                    const callHistoryResponse = await callHistory.getCallHistoryData(
                        numberOfDays,
                        callHistoryLimit,
                        callHistorySort,
                        callHistorySortBy
                    );
                
                    renderCallHistory(callHistoryResponse.data.userSessions);
                }
            }
        });
    });
}


const callNotifyEvent = new CustomEvent('line:incoming_call', {
    detail: {
        callObject: call,
    },
});

function registerLine(userType) {
    line.on('registered', (lineInfo) => {
        console.log("registered success");
        if (userType === 'customer') {
            customerLoginBtn.remove();
            loaderWrapperBtn1.classList.remove('customer-loader-wrapper');
        } else {
            agentLoginBtn.innerText = 'Agent : Benjamin';
            agentLoginBtn.classList.add('agent-login-btn');
            agentLoginBtn.disabled = false;
            loaderWrapperBtn2.classList.remove('agent-loader-wrapper');
        }

        line = lineInfo;
        console.log('Line Registered: ', line);
        // agentLoginBtn.innerHTML = `<span>Registered, deviceId:${deviceInfo.mobiusDeviceId}</span>`;
    });

    line.register();   

    // Start listening for incoming calls
    line.on('line:incoming_call', (callObj) => {
        callNotification.toggle();
        incomingCall = callObj;
        incomingCall.on('caller_id', (CallerIdEmitter) => {
          console.log(
                `callerId : Name: ${CallerIdEmitter.callerId.name}, Number: ${CallerIdEmitter.callerId.num}, Avatar: ${CallerIdEmitter.callerId.avatarSrc}, UserId: ${CallerIdEmitter.callerId.id}`
            );

            callerName.innerText = CallerIdEmitter.callerId.name;
            callerNumber.innerText = CallerIdEmitter.callerId.num;
            // if (CallerIdEmitter.callerId.avatarSrc) {
            //     img.src = CallerIdEmitter.callerId.avatarSrc;
            //     console.log(img.src);
            //     imageElm.appendChild(img);
            // }
        });

        callNotifyEvent.detail.callObject = callObj;
        correlationId = callObj.getCorrelationId();
        console.log(`APP.JS::  Incoming Call with correlationId: ${correlationId}`);
        broadworksCorrelationInfo = callObj.getBroadworksCorrelationInfo();
        if (broadworksCorrelationInfo !== undefined) {
            console.log(
                `APP.JS::  Incoming Call with broadworksCorrelationInfo: ${broadworksCorrelationInfo}`
            );
        }
        // callListener.dispatchEvent(callNotifyEvent);
        console.log('Waiting for User to answer the call...');
    });
}

async function initiateCall(number) {
    const destination = {
        value: number
    };
    callWindow.classList.add('customer-call-window');
    callWindowHeader.classList.add('call-window-header');
    callWindowBody.classList.add('call-window-body');
    callWindowFooter.classList.add('call-window-footer');
    await getMediaStreams(false);
    console.log(destination.value);
    call = line.makeCall({
        type: 'uri',
        address: destination.value,
    });

    call.on('caller_id', (CallerIdEmitter) => {
        console.log(
            `callerId : Name: ${CallerIdEmitter.callerId.name}, Number: ${CallerIdEmitter.callerId.num}, Avatar: ${CallerIdEmitter.callerId.avatarSrc}, UserId: ${CallerIdEmitter.callerId.id}`
        );
        callerName.innerText = CallerIdEmitter.callerId.name;
        callerNumber.innerText = CallerIdEmitter.callerId.num;
        // if (CallerIdEmitter.callerId.avatarSrc) {
        //     img.src = CallerIdEmitter.callerId.avatarSrc;
        //     imageElm.appendChild(img);
        // }
    });

    call.on('progress', (correlationId) => {

    });

    call.on('connect', (correlationId) => {
   
    });

    call.on('remote_media', (track) => {
        document.getElementById('customer-remote-audio').srcObject = new MediaStream([track]);
    });

    call.dial(localAudioStream);
    makeCallBtn.disabled = false;

    call.on('disconnect', (correlationId) => {
        callWindow.classList.remove('customer-call-window');
    });
}

async function answerCall() {
    callNotification.toggle();
    const callWindow = document.getElementById('agent-call-window');
    callWindow.classList.add('agent-call-window');
    callWindowHeader.classList.add('call-window-header');
    callWindowBody.classList.add('call-window-body');
    callWindowFooter.classList.add('call-window-footer');
    await getMediaStreams(true);

    incomingCall.answer(localAudioStream);

    incomingCall.on('remote_media', (track) => {
        document.getElementById('agent-remote-audio').srcObject = new MediaStream([track]);
    });


    incomingCall.on('disconnect', (correlationId) => {
        callWindow.classList.remove('agent-call-window');
        callWindowHeader.classList.remove('call-window-header');
        callWindowBody.classList.remove('call-window-body');
        callWindowFooter.classList.remove('call-window-footer');
    });
}


async function getMediaStreams(agent) {
    let localAudioElem;
    if (agent) {
        localAudioElem = document.getElementById('agent-local-audio');
        localAudioStream = await Calling.createMicrophoneStream({audio: true});
    } else {
        localAudioElem = document.getElementById('customer-local-audio');
        localAudioStream = await Calling.createMicrophoneStream({ audio: true });
    }

    localAudioElem.srcObject = localAudioStream.outputStream;
}

function disconnectCall() {
    call.end();
    callWindow.classList.remove('customer-call-window');
    callWindowHeader.classList.remove('call-window-header');
    callWindowBody.classList.remove('call-window-body');
    callWindowFooter.classList.remove('call-window-footer');
}