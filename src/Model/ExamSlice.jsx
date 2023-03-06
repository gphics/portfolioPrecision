import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import shortUUID from "short-uuid";
import { supabase } from "../Controller";
import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'
dayjs.extend(duration)
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

export const getCurrentExam = createAsyncThunk("getCurrentExam", async (examID, thunkAPI) => {
    const { data:firstData , error:firstError } = await supabase.from("exam")
        .select()
    .eq('exam_id', examID)
        .single()
 
    if (firstData) {
        const { data: secondData, error: secondError } = await supabase.from("user")
            .select()
            .eq("user_id", firstData.creator)
            .single()

        if (secondData) {
            const { data: thirdData, error: thirdError } = await supabase.from("question")
                .select()
                .eq("question_id", firstData.question_id)
                .single()
            const queImg = []
            thirdData.Test.forEach(elem => {
                if (elem.question_img_name !== '') queImg.push(elem.question_img_name)
            })
            if(thirdData) return [firstData, secondData, queImg]
        }
    }
})

export const fetchUpdateExam = createAsyncThunk('fetchUpdateExam', async (examID, thunkAPI) => {
    const { data: firstData, error: firstError } = await supabase.from('exam')
        .select().eq("exam_id", examID).single()
    const { starting_date, ending_date } = firstData
    const a = dayjs(starting_date).format('YYYY-MM-DD')
    const b = dayjs(ending_date).format('YYYY-MM-DD')
    if (firstData) {
        const { data: secondData, errror: secondError } = await supabase
            .from('question')
            .select()
            .eq('question_id', firstData.question_id)
            .single()
        
        if (secondData) {
            const { Test } = secondData
            const final = { ...firstData, Test, ending_date: b, starting_date: a }
            return final
        }
        }
})

export const updateExam = createAsyncThunk("updateExam", async (_, thunkAPI) =>{
    const state = thunkAPI.getState().examSlice.examCreate
    const { exam_id, exam_img_name, question_id, result_id, creator
        , participants, taken_by, description, title, starting_date, ending_date
        , is_available, Test, duration } = state
    const question = { Test, question_id }
    const rest = {
        exam_id, exam_img_name, question_id, result_id, creator
        , participants, taken_by, description, title, starting_date, ending_date
        , is_available, duration
    }
    const final =await Promise.allSettled([await supabase.from("exam").update(rest).eq("exam_id", exam_id).select(),
        await supabase.from("question").update(question).eq("question_id", question_id).select(),
    ])
    
})


export const deleteExam = createAsyncThunk("deleteExam", async (_, thunkAPI) => {
    const { result_id, exam_img_name, exam_id, question_id, creator } = thunkAPI.getState().examSlice.currentExam[0]
    const {queImg} = thunkAPI.getState().examSlice
    const { data, error } = await supabase.from("user")
        .select()
    .eq("user_id", creator)
        .single()
    if (data) {
        const exams_id = data.exams_id.filter(elem => elem !== exam_id)
        const results_id = data.results_id.filter(elem => elem !== result_id)
        const rest = { ...data, results_id, exams_id }
        
   
        const final = await Promise.allSettled([
            await supabase.from("user")
                .update(rest)
                .eq('user_id', creator)
                .select(),
            await supabase.from("exam")
                .delete()
                .eq("exam_id", exam_id),
            await supabase.from("question")
                .delete()
                .eq("question_id", question_id),
            await supabase.from("result")
                .delete()
                .eq("result_id", result_id),
            await supabase.storage.from("exam")
                .remove([`folder/${exam_img_name}`])
        ])
        if (queImg.length !== 0) {
            queImg.map(async (elem) => {
               const {data, error} = await supabase.storage.from("question")
                    .remove([`folder/${elem}`])
                console.log(data, error)
            })
        }

    
    }
    
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
    currentExam: [],
    queImg: []

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

            state.examCreate = {
                exam_id: id,
                result_id: shortUUID.generate(),
                question_id: shortUUID.generate(),
                title: '',
                creator: user_id,
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
        }).addCase(getCurrentExam.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(getCurrentExam.fulfilled, (state, action) => {
            state.currentExam = action.payload.slice(0, 2)
            state.queImg = action.payload[2]
            state.isLoading = false
        }).addCase(fetchUpdateExam.pending, (state, action) => {
            state.isLoading = true
        }).addCase(fetchUpdateExam.fulfilled, (state, action) => {
            state.examCreate = action.payload
            state.myExam = []
            state.myExamCopy = []
            state.allExam = []
            state.allExamCopy = []
            state.currentExam = []
            state.isLoading = false
        }).addCase(updateExam.pending, (state, action) => {
            state.isLoading = true
        }).addCase(updateExam.fulfilled, (state, action) => {
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
        }).addCase(deleteExam.pending, (state, action) =>{
            state.isLoading = true
        }).addCase(deleteExam.fulfilled, (state, action) => {
           
            state.currentExam = []
            state.allExam = []
            state.myExam = []
            state.allExamCopy = []
            state.myExamCopy = []
            state.queImg = []
            state.isLoading = false
        })
    }
})

export const {setDefault, IncreaseQuestion, sortMyExam,onRender, changeIsRedirect, DecreaseQuestion, changeInput, changeTest } = exam.actions
export const examSlice = exam.reducer