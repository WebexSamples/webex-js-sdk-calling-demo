
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
const accessToken = 'eyJhbGciOiJSUzI1NiJ9.eyJjbHVzdGVyIjoiQTUyRCIsInByaXZhdGUiOiJleUpqZEhraU9pSktWMVFpTENKbGJtTWlPaUpCTVRJNFEwSkRMVWhUTWpVMklpd2lZV3huSWpvaVpHbHlJbjAuLkZGaFlLZkh4N3lyZWtnRFhRVzRCWWcuNV85MC12Mm9jdko4YjVZcDdsc0xZLWF3V3JVZFA4aFVBQmh3TTZxcElSbGd1UzBJTm1HeDk0TkptZ3hvWHFnRnJQMlFaMFQzcHJwMWVPa0NESWJqUzNNWHpnQnBFVm1TdEtGLTdUaThDVlRQdU41SHQ5QlhkdEluXzFzWjBuU2pyQlNUMllzOWNkMGstcWs1MzlpckNsR21Td3dpcnVMSi15eERVMXZ2RmVuUmR6VWEtcGliVHM2TV9EbHI3SV8yMnhXU3ltVXF2dFFvNGM2X1ZXLVE5MXd0cnVsbDlfMXc1QW9lTksydTJQbmtVdHNPZVV2WUZwSDRZTXNSNDFTT2QtUlZMMmRwMzB6UTRsSnpwV1IzN2xkcUNnMzRCUjlxUl9pOFl1cXUzUnljQ0pFYjZDQ1h6WU5lamJRdGRqUjNLNVNqUUIxbU1TOEE0em9iQ2xROHozblpsd25Nb2Z3REdyZHRpVEZpNS1fdldueWJaLWtkSTJpWVJvaW5LVWV0UWpWZmt2SlZSWXJMdURVZzc4UW5tdUNJUE94TFB5S211ZXd3cTRMU0lOZUVGek1meVBKV2ViYlZoU3BpODJmWGVpTUNLc1ltRU53YVdIMWgzeGloTjhZYWtFZjVSSkZwVG1GSDJ3ZTI5aWNnNWxTb3M3ZW1hTjcwd29pMHdIRFNfckNlN1BiZ3ZTRzB4YUNaXzFEWUhNbnUxOW4xR2pnQ2xkTzNhZ0VHbGYyQzJjWTUtbTJxT2tuaHNGbDk1elJncERZMjZaa3A3LXpmbXppTzZKR0JNQVl4ZlVSY1M4UUFITGxCMFZGQVZEOG53YmVKMjNtX0Qtc25McU5UNkdOREtHanJ2dm5MQUtiVV9LaUdSNF9XSWUxZlRORUM0QW5Od1NPR0dLcDFnX2hyOWJCYVNjTDAzeUJEZEM3WXZ0eFF2eFp2UE95eDAtZWtocFVwRWY5S1RMa3RYTk9IRy10c2FzUm1aWXlnYTNLcFRBdnJ4NUc2bzAyc21TTnJ2VXpHWFpoc0VqTWZBcXJRNFVVb2NhSWJzc0sxTWZsQ29nNG1mSzlDY3FkRzIzZy5zdFd2V2lmQ3lzQVBfUW9FTFVLaTRBIiwidXNlcl90eXBlIjoidXNlciIsInRva2VuX2lkIjoiQWFaM3IwTVdZNVpqSTRaamN0WVdRME1pMDBORGczTFRrNE1EZ3RNVE15TXpCak1qZGxObVkwWkRSbU9UZzJaRGd0WWpWayIsInJlZmVyZW5jZV9pZCI6ImE3NDQwYzJkLTViY2YtNDk4My05ZWUzLTM5YzgxZWM2NzQ0YyIsImlzcyI6Imh0dHBzOlwvXC9pZGJyb2tlcmJ0cy53ZWJleC5jb21cL2lkYiIsInVzZXJfbW9kaWZ5X3RpbWVzdGFtcCI6IjIwMjIwODEwMTUwMzA3LjcxMloiLCJyZWFsbSI6IjE3MDRkMzBkLWExMzEtNGJjNy05NDQ5LTk0ODQ4NzY0Mzc5MyIsImNpc191dWlkIjoiNjA2MDg4Y2YtMzQ1ZS00MWYwLWFlOTAtOTkyMjk3YmNiMzg5IiwidG9rZW5fdHlwZSI6IkJlYXJlciIsImV4cGlyeV90aW1lIjoxNzE1MDQzMzk0MjAzLCJjbGllbnRfaWQiOiJDNjRhYjA0NjM5ZWVmZWU0Nzk4ZjU4ZTdiYzNmZTAxZDQ3MTYxYmUwZDk3ZmYwZDMxZTA0MGE2ZmZlNjZkN2YwYSJ9.QPfTNF4vyu65h9zPZcc3UYLjtQMP0zNOTXZ_iR3aqOsHg7JX1xmQEDQ2aTRF-U1qxTDO-btBLjRC_19oCN71PI7j2-ziigy1guykjsNTrVYH0XzqGRBzGjYiwZ8-Nx2rRUYmG82Exbc77xzG9K2Ik2XejfcHG9P8hkU7Qt8oB6DB2LdGOc2guZYG2myWyuiGISE_FTr525pCWL11XivW-YP8m_nw7iAHLZG_9Xp9qORPdDgPhJ0Niw2YIZvfoq0yWYb6MNFdfthgRZPQbFHoNuL7vKh1UlK-qNugHe3SjxJ9L4zu5ycblK9xG2HiD5K60mAaISzn7ykQ_v2ohQJJfQ'

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
