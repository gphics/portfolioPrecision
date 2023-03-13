import OptionComponent from "./OptionComponent"
export default function EachQuestionComponent({ answer, question, question_img_name, optionA, optionB, optionC, optionD, num }) {
    const imgUrl = `https://jcvvwzvbnanankfrxxzd.supabase.co/storage/v1/object/public/question/folder/${question_img_name}`

    const optionListing = [{ option: optionA },
    { option: optionB },
    { option: optionC },
    { option: optionD }
    ]
    return <section className='eachQuestionComponent hideEachExamQuestionComponent' data-tab={num}>
        <div className="examQuestionHouse flexColumn">
            {question_img_name && <img src={imgUrl} alt="question image" />}
            <p> {question} </p>
        </div>
        {optionListing.map((item, i) => <OptionComponent {...item} name={num} answer={answer} key={i} />)}
    </section>
}