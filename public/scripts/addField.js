function cloneField() {
    const newFieldContainer = document.querySelector(".schedule-items").cloneNode(true)

    const fields = newFieldContainer.querySelectorAll('input')

    fields.forEach(element => element.value = "");

    document.querySelector("#schedule-items").appendChild(newFieldContainer)
}

document.querySelector("#add-time").addEventListener('click', cloneField)
