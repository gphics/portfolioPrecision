import { useDispatch , useSelector} from "react-redux"

export default function OptionComponent({ option, name, answer }) {
    const { isPreview } = useSelector(state => state.examSlice)
    const dispatch = useDispatch()
    function onChangeHandler(e) {
        const value = e.target.value
        if (value === answer) {
            dispatch(updateScore({ value: 1, question: name }))
        } else {
            dispatch(updateScore({ value: 0, question: name }))
        }
    }

    return <div className="optionHouse flexRow" >
        <input type="radio" disabled={isPreview} onChange={onChangeHandler} name={name.toString()} value={option} />
        <label htmlFor=""> {option} </label>
    </div>
}