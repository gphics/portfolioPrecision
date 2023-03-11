import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../../../Controller"
import { BsArrowDownSquareFill, BsArrowUpSquareFill } from 'react-icons/bs'
export default function CreatorResult({ result_id, title }) {
    const { user: { user_id } } = useSelector(state => state.userSlice)
    const [result, setResult] = useState(null)
    const [show, setShow] = useState(false)
    async function fetchResults() {
        const { data, error } = await supabase.from("result")
            .select()
            .eq("result_id", result_id)
            .single()

        if (data) {
            const main = data.result.filter(elem => elem.creator === user_id)
            setResult(main)
        }
    }
    useEffect(() => {
        fetchResults()

    }, [])

    function toggleShow() {
        setShow(prev => !prev)
    }
    return <section className='eachCreatorResult'>
        {main && <>
            <div className="eachResult flexRow">
                <h4> {title} </h4>
                {show ? <BsArrowUpSquareFill onClick={toggleShow} className='showResultBtn' /> :
                    <BsArrowDownSquareFill onClick={toggleShow} className='showResultBtn' />
                }
            </div>
            {show &&
                <section className="creatorResultListing flexColumn">

                    <div className="eachResult flexRow">
                        <h4>student id</h4>
                        <h4>score</h4>
                    </div>
                    {result === null ? <div className='eachResult'></div> : result.map((item, i) => {
                        return <Link key={i} to={item.user_id} className="eachResult clickable flexRow">
                            <h5> {item.user_id} </h5>
                            <h4> {item.score} </h4>
                        </Link>
                    })}
                </section>
            }
        </>}
    </section>
}