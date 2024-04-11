const table = document.getElementById('tableBody_estudiante');

table.addEventListener('click',(e) => {
    console.log(e.target.parentElement.parentElement.children[0].textContent);
});