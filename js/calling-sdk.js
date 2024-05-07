
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

let access_token;

// Create the Webex configuration
// authentication 
const agentLoginBtn = document.querySelector('#agent-login-btn');
const customerLoginBtn = document.querySelector('#customer-login-btn');
const loaderWrapperBtn1 = document.querySelector('#customer-loader-wrapper');
const loaderWrapperBtn2 = document.querySelector('#agent-loader-wrapper');
const makeCallBtn = document.querySelector('.call-support-btn');


async function initCalling(userType) {
    if (userType === 'customer') {
        access_token = 'eyJhbGciOiJSUzI1NiJ9.eyJjbHVzdGVyIjoiUDBBMSIsInByaXZhdGUiOiJleUpqZEhraU9pSktWMVFpTENKbGJtTWlPaUpCTVRJNFEwSkRMVWhUTWpVMklpd2lZV3huSWpvaVpHbHlJbjAuLmtwSFN1cDl3OGUzdnZEeWFJc1RlUWcuYjBNbGZDWDIxaGRubktoM1A2ak1QcnpybkU2ZUlsdmp5bXlCNG81VkRzaXRxQS1ER1JkSFB4bGE0Q1o0d1B0UDJLOUdxd0hwMUhDQk4zN3JwUHZsSkRYeHp1cEcwM0JmQWlYd3ZSM2EtenliUV82U1FYelEtUGhHaWdTZ281SEJ5REF5eUNTWER3VUZRbXRILVlxWUNNZDhlR0laNXBEZlQ5TjJFM184SU9ueW92MjYyZXhkdWhYM213QklWaDI0X0dBUkhzU3lFR0ZVeG03bFltOU5zekZBX0NRVktsTFkwa0VvTEdLcEtiWDdaeF9qZHIzZHNNSVljemd5VllUYmpjeW5XQU5SYVRpVUU3M3lxS2NaLTZ1R3VLYTVkZjBYQS1BZ1Vqd05uYlNrVnE5Z2VuNGhFN21xUWV5dlVlQ180ZTNDRmxxcENEd0NCQ1FzRWhTell1VF8xdXJxYUdzM09pbHFjbVJDemt2ZlludGZrNHY3Tkt3OThqLTB3SG54OTJTWFpIRlhQRWZ3NlhVNTNaS3pxMUtDbjlZWGxSbkU5S0xJREY3M1VkcXJwdXNVVERORzZqY2t6UGhTZ3FwcllFZF9PWi1DUEtPT3o2cEYybUZDUWZhMDRLZDktNkN4dFFSVDRzSWhOWkRQZTQtdUlnWHBWcmMySDR2SGxXdUJ6Z1ZET1V4ZUZwOUJsSHR3Zlo1MmQ1T2Z0ZEFJS1pNNGhuTUF2VHNGTVZGelZEZHA2eThpZFpyOGVUbHJ0dUY2bEI3aHlEdElyYmszMHRMQ2NXdlVnZEd2WTJoOU1KTTlDSEd3UG13SmZFTHE2d1VCMEVrREt0M09BTE1ZQkRKeVNYaWZqbVk1N0hpMXN5LUZWOEpUUDR0TDJ4ZUJrUks5R2ZENEo1d3VMNU9tcVlYaTE0UjNKM29sVHQyN2tjNHNUbE5Hc2xNcm9nUWJDSmM3WG5QT1hab2FoX0NkeTFvZlhpZjh4dTdGNWZGTkFOY3UyZ1JIVFYyOEpERVdzdnJZdy1MR2ZZUXltek4xWXZJZEVuRHJ4OGhveXRBRUUwemVPelJaTTB1Q1g4US42VkJUeFpRWVE4SE1hU0RVWER3YzFRIiwidXNlcl90eXBlIjoidXNlciIsInRva2VuX2lkIjoiQWFaM3IwWmpNNU5qZ3habUl0TkdVNU1DMDBZemN3TFRnMU4ySXRaV1ptTUdaaU5XVXhNamt5WTJReU1tRmhOV0l0T1RBdyIsInJlZmVyZW5jZV9pZCI6ImQwMTEzZmQxLWM2NWUtNGZkMy04NDllLWMxYzUzNmVhMzdmYyIsImlzcyI6Imh0dHBzOlwvXC9pZGJyb2tlci1iLXVzLndlYmV4LmNvbVwvaWRiIiwidXNlcl9tb2RpZnlfdGltZXN0YW1wIjoiMjAyNDAyMjYxMDM4MDYuODgzWiIsInJlYWxtIjoiYjY1N2ZjZjMtNmIwNi00NmE0LWFiMGUtZjIzZmNlYjdhNDQ3IiwiY2lzX3V1aWQiOiI0ODQ0OGZhNy03MmM5LTRhZWItYTgzZi1kYjgyZTk3MWJlNjQiLCJ0b2tlbl90eXBlIjoiQmVhcmVyIiwiZXhwaXJ5X3RpbWUiOjE3MTUxMzIwNjQ4NDUsImNsaWVudF9pZCI6IkM2NGFiMDQ2MzllZWZlZTQ3OThmNThlN2JjM2ZlMDFkNDcxNjFiZTBkOTdmZjBkMzFlMDQwYTZmZmU2NmQ3ZjBhIn0.SppxJ5Op2RyrBXOUUaqqepSy37h9jF1oea-8oKqk8kloTcU_qLf7oAGMZVul7ftobFoO1jMx9eyLb6MjjWU4fIhfILUveT_xMrRNGeo_jePgNSh2VL3RodWZIVVkbSmZBaYuFRmyRGNMx_XkuzYRwt4-Xl9okQjXTo8GS8PUVBbIFwphyoPBpnfW1JLOrXjcJM9Gw7hGqZBchQCS6lvoxtWJV4S4vPj7sr1UBoXdEw3jSoWFNaFF_F4BAI608KUggmx_LseTKLoa1WRBGuJsgMXjPO4jGgXWwzu2XbTCBsOSw14eudzFgcKWzLUPW-ZAATtcmNH6-eGViOoG8SxI4Q';
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

async function openCallWindow() {
    const callWindow = document.getElementById('customer-call-window');
    callWindow.style.display = 'flex';
    await getMediaStreams();
    makeCall();
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
    const localAudioElem = document.getElementById('local-audio');
    localAudioStream = await Calling.createMicrophoneStream({ audio: true });

    localAudioElem.srcObject = localAudioStream.outputStream;
    makeCallBtn.disabled = false;
}
