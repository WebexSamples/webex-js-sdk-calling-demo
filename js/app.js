let agentNumpad;
const callNotification = document.getElementById('callNotification');

callNotification.__proto__.toggle = () => {
    if(callNotification.classList.contains('show-notification')){
        callNotification.classList.remove('show-notification');
        setTimeout(() => callNotification.classList.remove('timestate'), 2500);
    }
    else{
        callNotification.classList.add('show-notification');
    }
}

callNotification.__proto__.startTimer = () => {
    callNotification.classList.contains('timestate') ? callNotification.classList.remove('timestate') : callNotification.classList.add('timestate');
}

window.onload = () => {
    const agentNumpadTrigger = document.getElementById('agent-numpad-trigger');
    agentNumpad = document.getElementById('agent-numpad');
    agentNumpadTrigger.addEventListener('click', () => 
        agentNumpad.classList.contains('show') ? agentNumpad.classList.remove('show') : agentNumpad.classList.add('show')
    );
}

function swapDivs() {
    var mikeross = document.getElementsByClassName('hider-mikeross');
    var harveyspecter = document.getElementsByClassName('hider-harveyspecter');
    for (var i = 0; i < mikeross.length; i++) {
        mikeross[i].style.display = 'none';
    }
    for (var i = 0; i < harveyspecter.length; i++) {
        harveyspecter[i].style.display = 'block';
    }
}