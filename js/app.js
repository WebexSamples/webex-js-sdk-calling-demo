//write method swapDivs to hide all elements with class name 'hider-mikeross' and show all elements with class name 'hider-harveyspecter'
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

let agentNumpad;

window.onload = () => {
    const agentNumpadTrigger = document.getElementById('agent-numpad-trigger');
    agentNumpad = document.getElementById('agent-numpad');
    agentNumpadTrigger.addEventListener('click', () => 
        agentNumpad.classList.contains('show') ? agentNumpad.classList.remove('show') : agentNumpad.classList.add('show')
    );
}