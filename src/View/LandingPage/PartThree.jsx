import React from 'react'
import {Card} from '../Utils'
import cardHeroOne from '../../Asset/SVG/First_Card_Hero.svg'
import cardHeroTwo from '../../Asset/SVG/Second_Card_Hero.svg'
import cardHeroThree from '../../Asset/SVG/Third_Card_Hero.svg'
import footerHero from '../../Asset/SVG/Footer_Hero.svg'
import { Link } from 'react-router-dom'



const cardItems= [
  { title: 'Hosting', img: cardHeroOne, body: "We help educational institution host their exam online" },
  { title: ' Delivering', img: cardHeroTwo, body: " We deliver swiftly the hosted exam to the students" },
  {title: 'Calculating', img: cardHeroThree, body: 'We automatically calculate the results after examination'}
]



function PartThree() {
  return (
    <div id="partThree" className="flexColumn">
      <section className="partThreeTitle">
        <h1>our services</h1>
      </section>
      <section className="flexRow cardHolder">
        {cardItems.map((item, i) => <Card key={i} mainClass="eachCard" {...item} />)}
      </section>
      <section className="footer flexRow">
        <div className="footerText flexColumn">
          <p>Examination has never been this easy, let the 
            transformation start from you.
          </p>
          <Link className="moveTo" to="/landing/register">get started</Link>
        </div>
        <div className="footerImage">
          <img src={footerHero} alt="" />
        </div>
      </section>
    </div>
  )
}

export default PartThree