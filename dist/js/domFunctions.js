export const addSpinner = (element) => {
  animateButton(element);
  setTimeout(animateButton, 1000, element);
}

const animateButton = (element) => {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
}
