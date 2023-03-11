
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../../../Controller"
export default function StudentResults({ result_id, title, taken_by }) {
    const { user: { user_id } } = useSelector(state => state.userSlice)
    const [score, setScore] = useState(0)
    const [isTaken, setIsTaken] = useState(false)
    async function fetchScore() {
        const { data, error } = await supabase.from("result")
            .select()
            .eq("result_id", result_id)
            .single()

        if (data) {
            data.result.forEach(elem => {
                if (elem.user_id === user_id) {
                    setScore(elem.score)
                }
            })
        }
    }
    useEffect(() => {
        fetchScore()
        taken_by.forEach(elem => {
            if (elem === user_id) {
                setIsTaken(true)
            }
        })
    }, [])
    if (!isTaken) {
        return <></>
    }
    return <div className="eachResult flexRow">
        <h4> {title} </h4>
        <h4> {score} </h4>
    </div>

}