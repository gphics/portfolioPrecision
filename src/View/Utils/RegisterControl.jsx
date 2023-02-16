import React, {useEffect} from 'react'

function RegisterControl() {

    function Show(e) {
        e.preventDefault()
        const value = e.target.textContent

        const sect = document.querySelectorAll(".regPart")
        sect.forEach(elem => {
                
            // // alert(typeof elem.dataset.tab)
            if (elem.dataset.tab === value) {
                elem.classList.remove("hideForm")
                if (elem.dataset.tab === '3') {
                    document.querySelector("#regBtn").classList.remove('hideForm')
                }
            } else {
                elem.classList.add("hideForm")
            }
        })
    }
  return (
      <aside id="CONTROL" className="controlBtnHolder flexColumn">
          <span className="controlSpan">
              <button id="controlOne" onClick={Show} className="controlBtn">1</button>
          </span>
          <span className="controlSpan flexColumn">
              <button id="controlTwo" onClick={Show} className="controlBtn">2</button>
              <button id="controlThree" onClick={Show} className="controlBtn">3</button>
          </span>
          
    </aside>
  )
}

export default RegisterControl