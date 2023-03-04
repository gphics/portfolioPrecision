

export default function Intersection(elem, threshold, action) {
    const opt = {
        root: null,
        threshold
    }

    function Action(ent, observers) {
        ent.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.remove(action)
            } else {
                e.target.classList.add(action)
            }
        })
    }
    const observer = new IntersectionObserver(Action, opt)
    observer.observe(elem)
}