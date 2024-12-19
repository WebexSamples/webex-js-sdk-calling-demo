
// Globals
let calling;
let callingClient;
let correlationId;
let callHistory;
let line;
let call;
let incomingCall;
let localAudioStream;

const makeCallBtn = document.querySelector('.call-support-btn');
const muteBtn = document.getElementById('mute-unmute-btn');
const holdBtn = document.getElementById('hold-resume-btn');

const callNotifyEvent = new CustomEvent('line:incoming_call', {
    detail: {
        callObject: call,
    },
});

// Step 1: Initialize Calling, pass calling config with relevant values to setup different clients available in the Calling SDK
// Step 2: Fetch the calling client, fetch the lines created for the user whose access token has been shared and register the line
async function initCalling(userType) {
    const webexConfig = await getWebexConfig(userType);
    const callingConfig = await getCallingConfig();

    // Initializing Calling
    calling = await Calling.init({ webexConfig, callingConfig });
    
    try {

        // Listen for ready event to identify if calling is ready
        calling.on("ready", () => {
            // register with webex calling
            calling.register().then(async () => {
            
            // Fetch the calling client 
            callingClient = window.callingClient = calling.callingClient;
    
            // Fetch lines
            line = Object.values(callingClient?.getLines())[0];
    
            // Trigger Line Registration
            setupLineListeners();
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

// Step 3: Setup listeners on the registered line
function setupLineListeners() {
    try {
        line.on('registered', (lineInfo) => {    
            line = lineInfo;
            updateAvailability();
        });
    
        // Start listening for incoming calls
        line.on('line:incoming_call', (callObj) => {
            openCallNotification(callObj);
            incomingCall = callObj;
        });
    } catch (err) {
        console.log("DEMO: Failed while setting up line listeners");
    }
}



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

// Step 5: Create a call instance, get the stream and initiate an outbound call. Setup call listeners are the same time to the call progressing different states
async function initiateCall(number) {
   try {
        await getMediaStreams();
        if (number) {
            const destination = {
                value: number
            };
            openCallWindow(number);
            // Create call object
            call = line.makeCall({
                type: 'uri',
                address: destination.value,
            });
        } else {
            openCallWindow();
            call = line.makeCall();
        }
    
        call.on('caller_id', (CallerIdEmitter) => {
           updateCallerId(CallerIdEmitter);
        });
    
        call.on('progress', (correlationId) => {
            // Add ringback on progress
        });
    
        call.on('connect', (correlationId) => {
            if(number === "5007"){
                secondCallNotification.startTimer();
                secondCallNotification.enableCompleteTransfer();
            }
            else{
                if(window.location.href.includes('mytrips')){
                    callNotification.startTimer();
                }
            }
        });
    
        call.on('remote_media', (track) => {
            document.getElementById('customer-remote-audio').srcObject = new MediaStream([track]);
        });
    
        call.on('disconnect', (correlationId) => {
            closeCallWindow();
        });
    
        call.dial(localAudioStream);
    } catch (err) {
        console.log("DEMO: Failed in initiating call");
    }
}

// Step 6: Fetch the call instance from the call notification, setup call listeners, create media stream and answer the incoming call
async function answerCall() {
    try {
        fetchCallerBooking();

        await getMediaStreams();

        incomingCall.answer(localAudioStream);
        callNotification.startTimer();

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

// Step 7: Put the call on hold and resume back
function holdResume() {
    try {
        incomingCall.doHoldResume();
        callNotification.holdToggle();
    } catch (err) {
        console.log("DEMO: Failed in hold/resume");
    }
}

// Step 8: Disconnect the call
function disconnectCall() {
    try {
        call.end();
        closeCallWindow();
    } catch (err) {
        console.log("DEMO: failed to disconnect the call");
    }
}


// STEP 1-6 are the same.
// Step 7: Initiate the call transfer by putting the existing call on hold and initiating new call with transfer target
function initiateTransfer() {
    holdResume();
    callNotification.transferToggle();
    openKeypad();
}

// Step 8: Finish the consult transfer by connecting the caller with the transfer target
function commitConsultTransfer() {
    incomingCall.completeTransfer('CONSULT', call.getCallId(), undefined);
    callNotification.toggle();
    secondCallNotification.toggle();
}

// Mute or unmute the call
function toggleMute() {
    incomingCall.mute(localAudioStream);
    callNotification.muteToggle();
}
