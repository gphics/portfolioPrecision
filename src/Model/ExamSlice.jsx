import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import shortUUID from "short-uuid";
import { supabase } from "../Controller";

export const createExam = createAsyncThunk("createExam", async (_, thunkAPI) => {
    const { exam_id, exam_img_name, question_id, result_id, creator
        ,result, participants, taken_by, description, title, starting_date, ending_date
    ,is_available, Test, duration} = thunkAPI.getState().examSlice.examCreate

    const question = { Test, question_id }
    const results = { result, result_id }
    const rest = {
        exam_id, exam_img_name, question_id, result_id, creator
        , participants, taken_by, description, title, starting_date, ending_date
        , is_available, duration
    }
    const user = JSON.parse(JSON.stringify(thunkAPI.getState().userSlice.user))
    user.exams_id.unshift(exam_id)
    user.results_id.unshift(result_id)

    // const { data, error } = await supabase.from("user")
    //     .update(user).eq("user_id", creator)
    const final = await Promise.allSettled([supabase.from("question")
        .insert([question]),
        await supabase.from("user")
            .update(user).eq("user_id", creator)
        ,
        await supabase.from('exam')
            .insert([rest]),
        await supabase.from("result")
            .insert([results])
        
    ])
    // console.log(data, error)
})


export const getMyExam = createAsyncThunk("getMyExam", async (_, thunkAPI) => {
    const { data, error } = await supabase.from("exam").select().order("title")
    const user = thunkAPI.getState().userSlice.user
    const mine = data.filter(elem => elem.creator === user.user_id)
    
    return {mine, all: data}
})

const initialState = {
    myExamSearch: '',
    isLoading: false,
    isRedirect: false,
    examCreate: {
        exam_id: '',
        result_id: '',
        question_id: '',
        title: '',
        creator: '',
        participants: [],
        taken_by: [],
        description: '',
        exam_img_name: '',
        starting_date: '',
        ending_date: '',
        duration: '',
        is_available: false,
        Test: [{
            question_img_name: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            answer: '',
            question: ''
        }],
        result: []
    },
    myExam: [],
    myExamCopy: [],
    allExam: [],
    allExamCopy: [],


}
const exam = createSlice({
    name: "exams",
    initialState,
    reducers: {
        DecreaseQuestion: (state, action) => {
            if (state.examCreate.Test.length === 1) {
                return { ...state }
            }
            state.examCreate.Test.pop()
        },
        IncreaseQuestion: (state, action) => {
            const obj = {
                question_img_name: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                answer: '',
                question: ''
            }
            state.examCreate.Test.push(obj)

        },
        changeInput: (state, action) => {
            const { field, value } = action.payload
            state.examCreate[field] = value
        },
        onRender: (state, action) => {
            const { id, user_id } = action.payload
            state.examCreate.creator = user_id
            state.examCreate.question_id = shortUUID.generate()
            state.examCreate.exam_id = id
            state.examCreate.result_id = shortUUID.generate()
        },
        changeTest: (state, action) => {
            const { field, value, i } = action.payload
            state.examCreate.Test[i][field] = value
        },
        changeIsRedirect: (state, action) => {
             state.isRedirect = false
        },
        sortMyExam: (state, action) => {
            const { obj, value, type } = action.payload
            if (type === 'all') {
                state.myExamSearch = value

                if (state.myExamSearch === '') {
                    state.allExam = state.allExamCopy
                    return;
                } else {
                    state.allExam = obj
                }
            }
            state.myExamSearch = value
        
            if (state.myExamSearch === '') {
                state.myExam = state.myExamCopy
                return;
            } else {
                state.myExam = obj
            }
        },
        setDefault: (state, action)=>{
            return {
                ...state, myExam: [],
                myExamCopy: [],
                allExam: [],
                allExamCopy: [],
}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createExam.pending, (state, action) => {
            state.isLoading = true
        }).addCase(createExam.fulfilled, (state, action) => {
            state.isLoading = false
            state.isRedirect = true
            state.examCreate = {
                exam_id: '',
                result_id: '',
                question_id: '',
                title: '',
                creator: '',
                participants: [],
                taken_by: [],
                description: '',
                exam_img_name: '',
                starting_date: '',
                ending_date: '',
                duration: '',
                is_available: false,
                Test: [{
                    question_img_name: '',
                    optionA: '',
                    optionB: '',
                    optionC: '',
                    optionD: '',
                    answer: '',
                    question: ''
                }],
                result: []
            }
        }).addCase(createExam.rejected, (state, action) => {
            console.log(action)
        }).addCase(getMyExam.pending, (state, action) => {
            state.isLoading = true
        }).addCase(getMyExam.fulfilled, (state, action) => {
            const { mine, all } = action.payload;
            state.myExam = mine
            state.myExamCopy = mine
            state.allExam = all
            state.allExamCopy = all
            state.isLoading = false
        })
    }
})

export const {setDefault, IncreaseQuestion, sortMyExam,onRender, changeIsRedirect, DecreaseQuestion, changeInput, changeTest } = exam.actions
export const examSlice = exam.reducer