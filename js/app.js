let employees = [];
let originalEmployees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const searchInput = document.querySelector(".input");

fetch(urlAPI)
    .then(res => res.json())
    .then(res => {
        originalEmployees = res.results;
        displayEmployees(originalEmployees);
    })
    .catch(err => console.log(err))

function displayEmployees(employeeData) {
    employees = employeeData;
    let employeeHTML = '';
    employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;
    employeeHTML += `
        <div class="card" data-index="${index}">
            <img class="avatar" src="${picture.large}" />
            <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            </div>
        </div>
    `
    });
    gridContainer.innerHTML = employeeHTML;
}    

searchInput.addEventListener("input", () => {
    const inputValue = searchInput.value.toLowerCase();
    
    if (inputValue === "") {
        displayEmployees(originalEmployees);
    } else {
        const filteredEmployees = originalEmployees.filter((employee) => {
            const fullName = `${employee.name.first} ${employee.name.last}`.toLowerCase();
            return fullName.includes(inputValue);
        });
        displayEmployees(filteredEmployees);
    }
});

//Cycle through employees
function changeEmployee(e) {
    const currentIndex = parseInt(modalContainer.dataset.currentIndex);
    const newIndex = currentIndex + e;

    if (newIndex >= 0 && newIndex < employees.length) {
        displayModal(newIndex);
    }
}

function displayModal(index) {
    // use object destructuring make our template literal cleaner
    let { name, dob, phone, email, location: { city, street, state, postcode }, picture } = employees[index];
    let date = new Date(dob.date);
    const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr />
        <p>${phone}</p>
        <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
        <p>Birthday: ${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}</p>
        <div class="modal-buttons">
        <button class="btn-prev" onclick="changeEmployee(-1)">↩ Previous</button>
        <button class="btn-next" onclick="changeEmployee(1)">Next ↪</button>
        </div>
    </div>
    `;
    overlay.style.display = 'block';
    modalContainer.innerHTML = modalHTML;
    modalContainer.dataset.currentIndex = index;
}

gridContainer.addEventListener('click', e => {
    // make sure the click is not on the gridContainer itself
    if (e.target !== gridContainer) {
    // select the card element based on its proximity to actual element clicked
    const card = e.target.closest(".card");
    const index = card.getAttribute('data-index');
    displayModal(index);
    }
});

modalClose.addEventListener('click', () => {
    //overlay.classList.add("hidden");
    overlay.style.display = 'none';
});

//Generates the API cards
for (let i = 0; i < 12; i++) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = i; 
    card.innerHTML = `
      <img class="avatar" src=""/>
      <div class="text-container">
        <h2 class="name"></h2>
        <p class="email"></p>
        <p class="address"></p>
      </div>
    `;
    gridContainer.appendChild(card);
  
    //Event listener to open the modal
    card.addEventListener('click', (e) => {
      const index = card.getAttribute('data-index');
      displayModal(index);
    });
}