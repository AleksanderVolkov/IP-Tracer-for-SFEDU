// utils/handleClick.js
export default function handleClick() {
	const menuElement = document.querySelector('.search-menu');
  
	if (menuElement) {
	  const currentDisplay = window.getComputedStyle(menuElement).display;
	  if (currentDisplay === 'none' || currentDisplay === '') {
		menuElement.style.display = 'block';
	  } else {
		menuElement.style.display = 'none';
	  }
	} else {
	  console.error('Element with class "search-menu" not found.');
	}
  }
  