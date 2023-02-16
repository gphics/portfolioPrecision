import React,{useEffect} from 'react'
import PartOne from './PartOne'
import PartThree from './PartThree'
import PartTwo from './PartTwo'
import { ControllerUtils } from '../../Controller'
// import LandingNavbar from './LandingNavbar'
function Landing() {
  const {Intersection} = ControllerUtils

  useEffect(() => {
    const partOne = document.querySelector("#partOne")

    const partTwo = document.querySelector("#partTwo")

    const partThree = document.querySelector("#partThree")
    const sections = [partOne, partTwo, partThree]
    sections.forEach(elem => Intersection(elem, .5, 'slide'))
  }, [])
  return (
    <section className="flexColumn landingPage">
      {/* <LandingNavbar/> */}
          <PartOne />
          <PartTwo />
          <PartThree/>
    </section>
  )
}

export default Landing