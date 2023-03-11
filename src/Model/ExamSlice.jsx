import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import shortUUID from "short-uuid";
import { showNotification, supabase } from "../Controller";
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
    
})


export const getMyExam = createAsyncThunk("getMyExam", async (_, thunkAPI) => {
    const { data, error } = await supabase.from("exam").select().order("title")
    const user = thunkAPI.getState().userSlice.user
    const mine = data.filter(elem => elem.creator  === user.user_id || elem.participants.includes(user.user_id))
    
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
            const {Test} = thirdData
            Test.forEach(elem => {
                if (elem.question_img_name !== '') queImg.push(elem.question_img_name)
            })
            if(thirdData) return [{...firstData, Test}, secondData, queImg]
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
            })
        }

    
    }
    
})

export const registerForExam = createAsyncThunk("registerForExam", async (_, thunkAPI) => {
    const { Test, ...rest } = thunkAPI.getState().examSlice.currentExam[0]
    const { user_id } = thunkAPI.getState().userSlice.user
    const user = thunkAPI.getState().userSlice.user
    const userExamsID = JSON.parse(JSON.stringify(user.exams_id))
    userExamsID.push(rest.exam_id)
    const participants = JSON.parse(JSON.stringify(rest.participants))
    participants.push(user_id)
  
   
    const { data, error } = await supabase.from("exam")
        .update({ ...rest, participants })
        .eq("exam_id", rest.exam_id)
        .select()
    .single()

    if (data) {
        const { data: secondData, error: secondError } = await supabase.from("question")
            .select()
            .eq("question_id", rest.question_id)
            .single()
        if (secondData) {
            const { data: thirdData, error: thirdError } = await supabase.from("user")
                .update({ ...user, exams_id: userExamsID })
                .eq("user_id", user_id)
                .select()
                .single()
            if (thirdData) {
                const { Test } = secondData
                return { ...data, Test }  
            }
           
        }
    }
})

export const submitExam = createAsyncThunk("submitExam", async (_, thunkAPI) => {
    const {user: {user_id}} = thunkAPI.getState().userSlice
    const { score, currentExam } = thunkAPI.getState().examSlice
    const { result_id, taken_by, exam_id} = currentExam[0]
    const took = JSON.parse(JSON.stringify(taken_by))
    took.push(user_id)

    const { Test, ...rest } = currentExam[0]
    const {creator} = currentExam[0]
    const examStuff = { ...rest, taken_by: took }
    const resultStuff = { user_id, exam_id, score, creator }
    
    const { data, error } = await supabase.from("result")
        .select()
    .eq("result_id", result_id)
        .single()
    if (data) {
        const { result } = data
        const res = JSON.parse(JSON.stringify(result))
        res.push(resultStuff)
        const mainResultStufff = { ...data, result: res }
        
        const final = await Promise.allSettled([
            await supabase.from("exam")
                .update(examStuff)
                .eq("exam_id", exam_id)
                .select()
                .single()
            ,
            await supabase.from("result")
                .update(mainResultStufff)
            .eq("result_id", result_id)
                .select()
                .single()
            
        ])

        if(final) return final
   }
})
const initialState = {
    isPreview: false,
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
    queImg: [],
    score: 0

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
        setDefault: (state, action) => {
            return {
                isPreview: false,
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
                queImg: [],
                score: 0

            }
        },
        isExamNotLoading: (state, action) => {
            state.isLoading = false
        },
        isExamLoading: (state, action) => {
            state.isLoading = true
        },
        updateScore: (state, action) => {
            const {question, value} = action.payload
            state.currentExam[0].Test[question].score = value
        
        },
        setTotalScore: (state, action) => {
            state.score = action.payload
        }, setIsPreview: (state, action) => {
            state.isPreview = !state.isPreview
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
            // state.score = state.currentExam.Test.length
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
        }).addCase(registerForExam.pending, (state, action) => {
            state.isLoading = true
        }).addCase(registerForExam.fulfilled, (state, action) => {
            state.currentExam[0] = action.payload
            state.isLoading = false
        }).addCase(submitExam.pending, (state, action) => {
            state.isLoading = true
        }).addCase(submitExam.fulfilled, (state, action) => {
            state.isLoading = false
        })
    }
})

export const {setDefault,setTotalScore,setIsPreview, updateScore, IncreaseQuestion, sortMyExam,onRender, changeIsRedirect, DecreaseQuestion, changeInput, changeTest , isExamLoading, isExamNotLoading} = exam.actions
export const examSlice = exam.reducer