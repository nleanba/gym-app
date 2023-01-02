const modal = document.getElementById("edit-dialog");
const settingsElement = document.getElementById("settings");

const exercisesElement = document.getElementById("exercises");

const data = JSON.parse(localStorage.getItem("gym-app-data") || "[]");

function updateView() {
  exercisesElement.innerHTML = "";

  for (let index = 0; index < data.length; index++) {
    const exerciseElement = document.createElement("div");
    exerciseElement.classList.add("exercise");

    settingsHTML = "";
    for (const setting of data[index].settings) {
      settingsHTML +=
        `<div class="setting"><div>${setting.name}</div><div>${setting.value}</div></div>`;
    }

    exerciseElement.innerHTML = `<div class="code"><div>${
      data[index].code || "–"
    }</div><div>${data[index].sets || ""}</div></div>
    <div class="label">${data[index].name}</div>
    <div class="weight">${data[index].weight || "–"}</div>
    <div class="settings">${settingsHTML}</div>`;

    const actionsElement = document.createElement("div");
    actionsElement.classList.add("actions");

    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.addEventListener("click", (e) => openModal(index));
    actionsElement.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", (e) => {
      if (confirm(`Delete ${data[index].name}?`)) {
        data.splice(index, 1);
        localStorage.setItem("gym-app-data", JSON.stringify(data));
        updateView();
      }
    });
    actionsElement.appendChild(deleteButton);

    const addSetButton = document.createElement("button");
    addSetButton.innerText = "Plus";
    addSetButton.addEventListener("click", (e) => {
      data[index].sets++;
      updateView();
    });
    actionsElement.appendChild(addSetButton);

    exerciseElement.appendChild(actionsElement);

    exercisesElement.appendChild(exerciseElement);
  }
}

document.getElementById("add-settings").addEventListener("click", (e) => {
  const count = parseInt(settingsElement.getAttribute("data-settings"), 10);
  settingsElement.setAttribute("data-settings", count + 1);
  const newSettings = document.createElement("div");
  newSettings.innerHTML = ` <label>Name
    <input id="settings-${count}-name" type="text">
  </label>
  <label>Value
    <input id="settings-${count}-value" type="text">
  </label>`;
  settingsElement.appendChild(newSettings);
});

document.getElementById("reset-sets").addEventListener("click", (e) => {
  if (confirm("reset sets")) {
    for (let index = 0; index < data.length; index++) {
      data[index].sets = 0;
    }
    localStorage.setItem("gym-app-data", JSON.stringify(data));
    updateView();
  }
});

function openModal(index = -1) {
  for (node in settingsElement.childNodes) {
    if (node.nodeName === "div") settingsElement.removeChild(node);
  }
  settingsElement.setAttribute("data-settings", "0");

  if (index >= 0) {
    document.getElementById("code").value = data[index].code;
    document.getElementById("name").value.value = data[index].name;
    document.getElementById("weight").value = data[index].weight;
    for (let count = 0; count < data[index].settings.length; count++) {
      const newSettings = document.createElement("div");
      newSettings.innerHTML = ` <label>Name
    <input id="settings-${count}-name" type="text" value="${setting.name}">
  </label>
  <label>Value
    <input id="settings-${count}-value" type="text" value="${setting.value}">
  </label>`;
      settingsElement.appendChild(newSettings);
    }

    settingsElement.setAttribute("data-settings", data[index].settings.length);
  }
  modal.setAttribute("data-exercise", index);
  modal.showModal();
}

document.getElementById("add-exercise").addEventListener("click", (e) => {
  openModal();
});

modal.addEventListener("close", (e) => {
  if (modal.returnValue == "cancel") return;
  if (!document.getElementById("name").value) e.preventDefault();
  const settings = [];
  const count = parseInt(settingsElement.getAttribute("data-settings"), 10);
  for (let index = 0; index < count; index++) {
    settings.push({
      name: document.getElementById(`settings-${index}-name`).value,
      value: document.getElementById(`settings-${index}-value`).value,
    });
  }
  const exercise = {
    code: document.getElementById("code").value,
    name: document.getElementById("name").value,
    weight: document.getElementById("weight").value,
    sets: 0,
    settings,
  };
  const index = parseInt(modal.getAttribute("data-exercise"), 10);
  if (index >= 0) {
    data[index] = exercise;
  } else {
    data.push(exercise);
  }
  localStorage.setItem("gym-app-data", JSON.stringify(data));
  updateView();
});

updateView();
