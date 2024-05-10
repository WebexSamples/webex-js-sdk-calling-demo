
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
const muteBtn = document.getElementById('mute-unmute-btn');
const holdBtn = document.getElementById('hold-resume-btn');

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

    
    try {
        calling.on("ready", () => {
          console.log("Authentication :: Calling Ready");
    
          calling.register().then(async () => {
            // Fetch the calling client
            callingClient = window.callingClient = calling.callingClient;
    
            // Fetch lines
            line = Object.values(callingClient?.getLines())[0];
    
            // Trigger Line Registration
            setupLineListeners(userType);
            line.register();
    
            if (userType === "agent") {
              if (window.callHistory === undefined) {
                callHistory = window.callHistory = calling.callHistoryClient;
                callHistory.on(
                  "callHistory:user_recent_sessions",
                  (sessionData) => {
                    console.log(
                      "Users recent session data : ",
                      sessionData.data.userSessions.userSessions[0]
                    );
                  }
                );
    
                const numberOfDays = 7,
                  callHistoryLimit = 20,
                  callHistorySort = "ASC",
                  callHistorySortBy = "startTime";
    
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
    } catch (err) {
        console.log("DEMO: failed to finish initCalling", err);
    }
}


function setupLineListeners(userType) {
    try {
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
    } catch (err) {
        console.log("DEMO: Failed while setting up line listeners");
    }
}
    

const callNotifyEvent = new CustomEvent('line:incoming_call', {
    detail: {
        callObject: call,
    },
});

// Create microphone stream which will be used as local audio stream for calls
async function getMediaStreams() {
    try {
        const localAudioElem = document.getElementById('local-audio');
        localAudioStream = await Calling.createMicrophoneStream({audio: true});
        
        localAudioElem.srcObject = localAudioStream.outputStream;
    } catch (err) {
        console.log("DEMO: failed to get media");
    }
}

// Trigger an outbound call
async function initiateCall(number) {
   
        const destination = {
            value: number
        };
        openCallWindow(number);
        await getMediaStreams();
    
        // Create call object
        call = line.makeCall({
            type: 'uri',
            address: destination.value,
        });
    
        call.on('caller_id', (CallerIdEmitter) => {
           updateCallerId(CallerIdEmitter);
        });
    
        call.on('progress', (correlationId) => {
            // Add ringback on progress
        });
    
        call.on('connect', (correlationId) => {
            // start the timer
        });
    
        call.on('remote_media', (track) => {
            document.getElementById('customer-remote-audio').srcObject = new MediaStream([track]);
        });
    
        call.on('disconnect', (correlationId) => {
            closeCallWindow();
        });
    
        call.dial(localAudioStream);
    // } catch (err) {
    //     console.log("DEMO: Failed in initiating call");
    // }
}

async function answerCall() {
    try {
        callNotification.toggle();
        swapDivs();
        openCallWindow();
        await getMediaStreams();

        incomingCall.answer(localAudioStream);

        incomingCall.on('caller_id', (CallerIdEmitter) => {
            callerName.innerText = 'Harvey Spector';
            callerNumber.innerText = CallerIdEmitter.callerId.num;
        });

        incomingCall.on('remote_media', (track) => {
            document.getElementById('agent-remote-audio').srcObject = new MediaStream([track]);
        });


        incomingCall.on('disconnect', (correlationId) => {
            closeCallWindow();
        });
    } catch (err) {
        console.log("DEMO: failed to answer the call.");
    } 
}

// Mute or unmute the call
function toggleMute() {
    incomingCall.mute(localAudioStream);
    updateBtnText(muteBtn);
}

// Trigger hold or resume
function holdResume() {
    try {
        incomingCall.doHoldResume();
        updateBtnText(holdBtn);
    } catch (err) {
        console.log("DEMO: Failed in hold/resume");
    }
}

// Disconnect the call
function disconnectCall() {
    try {
        call.end();
        closeCallWindow();
    } catch (err) {
        console.log("DEMO: failed to disconnect the call");
    }
}


// Initiate call transfer, puts the existing call on hold and initiates new call with transfer target
function initiateTransfer() {
    holdResume();
    openKeypad();
}

// Finished the consult transfer by connecting the caller with the transfer target
function commitConsultTransfer() {
    incomingCall.completeTransfer('CONSULT', call.getCallId(), undefined);
}