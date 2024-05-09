
// Globals
let calling;
let callingClient;
let correlationId;
let callHistory;
let line;
let call;
let incomingCall;
let localAudioStream;

const agentLoginBtn = document.querySelector('#agent-login-btn');
const customerLoginBtn = document.querySelector('#customer-login-btn');
const makeCallBtn = document.querySelector('.call-support-btn');
const callerName = document.getElementById('caller-name');
const callerNumber = document.getElementById('caller-number');
const muteBtn = document.getElementById('mute-unmute-btn');
const holdBtn = document.getElementById('hold-resume-btn');

function setupLineListeners(userType) {
    line.on('registered', (lineInfo) => {
        if (userType === 'agent') {
            agentLoginBtn.innerText = 'Agent : Benjamin';
            agentLoginBtn.classList.add('agent-login-btn');
            agentLoginBtn.disabled = false;
        }

        line = lineInfo;
    });

    // Start listening for incoming calls
    line.on('line:incoming_call', (callObj) => {
        callNotification.toggle();
        incomingCall = callObj;
        incomingCall.on('caller_id', (CallerIdEmitter) => {
            callerName.innerText = 'Harvey Spector';
            callerNumber.innerText = CallerIdEmitter.callerId.num;
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
    });
}


async function initCalling(userType) {
    const accessToken = getAccessToken(userType);

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

    // Initializing Calling
    calling = await Calling.init({ webexConfig, callingConfig });

    calling.on('ready', () => {
        console.log('Authentication :: Calling Ready');

        calling.register().then(async () => {

            // Fetch the calling client 
            callingClient = window.callingClient = calling.callingClient;

            // Fetch lines
            line = Object.values(callingClient?.getLines())[0];
            
            // Trigger Line Registration
            setupLineListeners(userType);
            line.register();
            
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

// Create microphone stream which will be used as local audio stream
async function getMediaStreams() {
    const localAudioElem = document.getElementById('local-audio');
    localAudioStream = await Calling.createMicrophoneStream({audio: true});

    localAudioElem.srcObject = localAudioStream.outputStream;
}

// Trigger an outbound call
async function initiateCall(number) {
    const destination = {
        value: number
    };
    openCallWindow();
    await getMediaStreams();

    // Create call object
    call = line.makeCall({
        type: 'uri',
        address: destination.value,
    });

    call.on('caller_id', (CallerIdEmitter) => {
        console.log(
            `callerId : Name: ${CallerIdEmitter.callerId.name}, Number: ${CallerIdEmitter.callerId.num}, Avatar: ${CallerIdEmitter.callerId.avatarSrc}, UserId: ${CallerIdEmitter.callerId.id}`
        );
        callerName.innerText = 'Benjamin';
        callerNumber.innerText = CallerIdEmitter.callerId.num;
    });

    call.on('progress', (correlationId) => {
    
    });

    call.on('connect', (correlationId) => {
   
    });

    call.on('remote_media', (track) => {
        document.getElementById('customer-remote-audio').srcObject = new MediaStream([track]);
    });

    call.on('disconnect', (correlationId) => {
        closeCallWindow();
    });

    call.dial(localAudioStream);
}

async function answerCall() {
    callNotification.toggle();
    openCallWindow();
    await getMediaStreams();

    incomingCall.answer(localAudioStream);

    incomingCall.on('remote_media', (track) => {
        document.getElementById('agent-remote-audio').srcObject = new MediaStream([track]);
    });


    incomingCall.on('disconnect', (correlationId) => {
        closeCallWindow();
    });
}


// Mute or unmute the call
function toggleMute() {
    incomingCall.mute(localAudioStream);
    if (muteBtn.innerText === 'Mute') {
        muteBtn.innerText = 'Unmute'
    } else {
        muteBtn.innerText = 'Mute'
    }
}

// Trigger hold or resume
function holdResume() {
    incomingCall.doHoldResume();
    if (holdBtn.innerText === 'Hold') {
        holdBtn.innerText = 'Resume';
    } else {
        holdBtn.innerText = 'Hold'
    }
}

// Disconnect the call
function disconnectCall() {
    call.end();
    closeCallWindow();
}

function initiateConsultTransfer() {
    holdResume();
    // Open keypad
}

function commitConsultTransfer() {
    call.completeTransfer(incomingCall.correlationId);
}