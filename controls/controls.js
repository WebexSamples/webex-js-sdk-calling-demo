const phoneNumberInputElm = document.getElementById('phone-number');
const keypadBtnContainerElm = document.getElementById('keypad-btn-container');
const inputClearBtn = document.getElementById('input-clear-btn');

const ACCEPTED_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#'];
const regexForKeypad = /^[0-9*#]*$/;

let phoneNumber = '';

keypadBtnContainerElm.addEventListener('click', function (event) {
  event.preventDefault();

  try {
    const value = event.target.id;

    if (!ACCEPTED_KEYS.includes(value)) return;

    phoneNumberInputElm.value += value;
    phoneNumber = phoneNumberInputElm.value;

    showClearButton();
  } catch (error) {
    console.error('Keypad error: ', error);
  }
});

inputClearBtn.addEventListener('click', function (event) {
  event.preventDefault();

  phoneNumberInputElm.value = '';
  phoneNumber = '';
  inputClearBtn.classList.remove('show');
});

phoneNumberInputElm.addEventListener('input', function (event) {
  event.preventDefault();

  const value = event.target.value;

  if (!regexForKeypad.test(value)) {
    phoneNumberInputElm.value = phoneNumber;

    return;
  }

  phoneNumber = value;

  showClearButton();
});

function showClearButton() {
  if (phoneNumber.length > 0) {
    inputClearBtn.classList.add('show');
  } else {
    inputClearBtn.classList.remove('show');
  }
}
