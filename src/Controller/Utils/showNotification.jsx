
export default function show(text) {
    const elem = document.querySelector(".Notification")
    const note = document.querySelector("#alert")
    note.textContent = text
    elem.classList.remove("hideForm")

    setTimeout(() => {
        elem.classList.add("hideForm")
    }, 6000)
}