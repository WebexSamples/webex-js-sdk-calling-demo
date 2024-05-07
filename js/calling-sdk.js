
// Globals
let calling;
let callingClient;
let correlationId;
let callHistory;
let line;
let call;
let localAudioStream;

const destination = {
    value: '88885957'
};
const accessToken = 'ZTAwYjFlMGUtYzViMC00OGFjLWJmZmMtYmM0MGY0YTU4MTVkOTcwZDczNjktNmU2_A52D_1704d30d-a131-4bc7-9449-948487643793'

// Create the Webex configuration
// authentication 
const agentLoginBtn = document.querySelector('#agent-login-btn');
const loaderWrapperBtn = document.querySelector('#loader-wrapper');
const makeCallBtn = document.querySelector('.call-btn');


async function initCalling() {
    console.log('Authentication#initWebex()');
    agentLoginBtn.disabled = true;
    loaderWrapperBtn.classList.add('loader-wrapper');

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
            access_token: accessToken
        }
    };
    // right now we are doing it with INT ENV
    let enableProd = false;
    if (!enableProd) {
        webexConfig.config.services = {
            discovery: {
                u2c: 'https://u2c-intb.ciscospark.com/u2c/api/v1',
                hydra: 'https://apialpha.ciscospark.com/v1/',
            },
        };
    }

    const clientConfig = {
        calling: true,
        callHistory: true,
        callSettings: true,
    }

    const loggerConfig = {
        level: 'info'
    }

    const serviceData = { indicator: 'calling', domain: '' };

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
            fetchLines();
            getMediaStreams();
            //line registration 
            createCalling();
        });
    });

    return false;
}


const callNotifyEvent = new CustomEvent('line:incoming_call', {
    detail: {
        callObject: call,
    },
});

function createCalling() {

    line.on('registered', (deviceInfo) => {
        console.log("registered success");
        // agentLoginBtn.innerHTML = `<span>Registered, deviceId:${deviceInfo.mobiusDeviceId}</span>`;
        userSession();
    });

    line.register();
    agentLoginBtn.innerText = 'Agent : Benjamin';
    agentLoginBtn.classList.add('agent-login-btn');
    agentLoginBtn.disabled = false;
    loaderWrapperBtn.classList.remove('loader-wrapper');

    // Start listening for incoming calls
    line.on('line:incoming_call', (callObj) => {
        call = callObj;
        call.on('caller_id', (CallerIdEmitter) => {
            callDetailsElm.innerText = `Name: ${CallerIdEmitter.callerId.name}, Number: ${CallerIdEmitter.callerId.num}, Avatar: ${CallerIdEmitter.callerId.avatarSrc}, UserId: ${CallerIdEmitter.callerId.id}`;
            console.log(
                `callerId : Name: ${CallerIdEmitter.callerId.name}, Number: ${CallerIdEmitter.callerId.name}, Avatar: ${CallerIdEmitter.callerId.avatarSrc}, UserId: ${CallerIdEmitter.callerId.id}`
            );
            if (CallerIdEmitter.callerId.avatarSrc) {
                img.src = CallerIdEmitter.callerId.avatarSrc;
                console.log(img.src);
                imageElm.appendChild(img);
            }
        });

        call.on('disconnect', () => {
            callDetailsElm.innerText = `${correlationId}: Call Disconnected`;
            makeCallBtn.disabled = false;
            endElm.disabled = true;
            muteElm.value = 'Mute';
            holdResumeElm.value = 'Hold';
            answerElm.disabled = true;
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
        callListener.dispatchEvent(callNotifyEvent);
        console.log('Waiting for User to answer the call...');
    });
}

function fetchLines() {
    line = Object.values(callingClient?.getLines())[0];
}



function makeCall() {

    console.log(destination.value);
    // makeCallBtn.disabled = true;
    // outboundEndElm.disabled = false;
    call = line.makeCall({
        type: 'uri',
        address: destination.value,
    });

    call.on('caller_id', (CallerIdEmitter) => {
        callDetailsElm.innerText = `Name: ${CallerIdEmitter.callerId.name}, Number: ${CallerIdEmitter.callerId.num}, Avatar: ${CallerIdEmitter.callerId.avatarSrc} , UserId: ${CallerIdEmitter.callerId.id}`;
        console.log(
            `callerId : Name: ${CallerIdEmitter.callerId.name}, Number: ${CallerIdEmitter.callerId.num}, Avatar: ${CallerIdEmitter.callerId.avatarSrc}, UserId: ${CallerIdEmitter.callerId.id}`
        );
        if (CallerIdEmitter.callerId.avatarSrc) {
            img.src = CallerIdEmitter.callerId.avatarSrc;
            imageElm.appendChild(img);
        }
    });

    call.on('progress', (correlationId) => {
        callDetailsElm.innerText = `${correlationId}: Call Progress`;
    });
    call.on('connect', (correlationId) => {
        callDetailsElm.innerText = `${correlationId}: Call Connect`;
    });
    call.on('established', (correlationId) => {
        callDetailsElm.innerText = `${correlationId}: Call Established`;
        transferElm.disabled = false;
    });
    call.on('disconnect', (correlationId) => {
        callDetailsElm.innerText = `${correlationId}: Call Disconnected`;
        makeCallBtn.disabled = false;
        endElm.disabled = true;
        muteElm.value = 'Mute';
        outboundEndElm.disabled = true;

        if (transferInitiated) {
            transferDetailsElm.innerText = `Transferred Successfully`;
            transferInitiated = false;
            transferElm.innerHTML = 'Transfer';
        }
    });

    call.on('remote_media', (track) => {
        document.getElementById('remote-audio').srcObject = new MediaStream([track]);
    });

    call.dial(localAudioStream);
}

async function getMediaStreams() {
    localAudioStream = await Calling.createMicrophoneStream({ audio: true });

    localAudioElem.srcObject = localAudioStream.outputStream;
    makeCallBtn.disabled = false;
}
