console.log("it works");
const baseMetUrl = "https://collectionapi.metmuseum.org/public/collection/v1/";
let departmentSelectionId, listItem;
const navContainer = document.getElementById("nav-container");

async function getDepartments() {
  try {
    const url = baseMetUrl + "departments";
    const response = await fetch(url, { mode: "cors" });
    const json = await response.json();
    const departments = json.departments;
    appendDepartments(departments);
    console.log(departments);
  } catch (error) {
    console.log(error);
  }
}
getDepartments();

function appendDepartments(data) {
  const list = document.getElementById("nav-departments");
  data.forEach((departmentName) => {
    const listItem = document.createElement("li");
    listItem.textContent = departmentName.displayName;
    listItem.classList.add("department-name");
    listItem.setAttribute("data-id", departmentName.departmentId);
    list.appendChild(listItem);

    listItem.addEventListener("click", function (event) {
      handleDepartmentListClick(event);
    });
  });
}

function handleDepartmentListClick(event) {
  const itemCard = document.getElementById("item-card");
  const currentSelection = event.target;
  if (itemCard.hasAttribute("hidden")) itemCard.removeAttribute("hidden");

  const departmentLists = document.querySelectorAll(".department-name");
  //remove current selected link
  departmentLists.forEach((dept) => {
    dept.classList.remove("selected-list-item");
  });
  //set current link as selected
  currentSelection.classList.add("selected-list-item");
  toggleNavList();
  getObjectIds(currentSelection.dataset.id);
}

function toggleNavList() {
  navContainer.classList.toggle("nav-container-hidden");
  navContainer.classList.toggle("slide-in");
}

//api call to retrieve list of object ids
async function getObjectIds(departmentId) {
  try {
    const url = `${baseMetUrl}search?departmentId=${departmentId}&hasImages=true&q=cat`;
    const response = await fetch(url, { mode: "cors" });
    const json = await response.json();
    getObjectData(json.objectIDs);
    console.log(json.objectIDs);
  } catch (error) {
    console.log(error);
  }
}
//api call to retrieve muesum item
async function getObjectData(ids) {
  //randomise selection of the id to display
  const randomIndex = Math.floor(Math.random() * ids.length);
  try {
    const url = `${baseMetUrl}objects/${ids[randomIndex]}`;
    const response = await fetch(url, { mode: "cors" });
    const json = await response.json();
    console.log(json);
    displayObjectData(json);
  } catch (error) {
    console.log(error);
  }
}

function displayObjectData(item) {
  const title = document.querySelector(".title");
  const image = document.querySelector(".image");
  const artist = document.querySelector(".artist");
  const classification = document.querySelector(".classification");
  const culture = document.querySelector(".culture");
  const medium = document.querySelector(".medium");
  const metLink = document.querySelector(".met-link");
  const date = document.querySelector(".date");

  title.textContent = item.title;
  image.src = item.primaryImageSmall;
  artist.textContent = item.artistDisplayName;
  classification.textContent = item.classification;
  culture.textContent = item.culture;
  medium.textContent = item.medium;
  metLink.href = item.objectURL;
  date.textContent = item.objectDate;
}

const navButton = document.getElementById("nav-button");
navButton.addEventListener("click", toggleNavList);
