import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification, supabase } from "../Controller";
import shortUUID from "short-uuid";

export const registerUser = createAsyncThunk("registerUser", async (_, thunkAPI) => {
    const main = thunkAPI.getState().userSlice.register

    const user_id = shortUUID.generate()
    const contact = +main.contact
    const state = { ...main, user_id, contact }
    const { data, error } = await supabase.from("user")
        .insert([state])
        .select()
        .single()
    return data

})
export const updateUser = createAsyncThunk("updateUser", async (_, thunkAPI) => {
    const main = thunkAPI.getState().userSlice.register
    const contact = +main.contact
    const state = { ...main, contact }

    const { data, error } = await supabase.from("user")
        .update(state)
        .eq('user_id', main.user_id)
        .select()
        .single()

    return data
})

export const loginUser = createAsyncThunk("loginUser", async (_, thunkAPI) => {


    const main = thunkAPI.getState().userSlice.login

    const { data, error } = await supabase.from("user")
        .select()
        .eq("email", main.email)
        .single()

    if (error) {
        showNotification("Incorrect login details")
        return null
    }

    if (data) {
        const { password } = data
        if (password === main.password) {
            return data
        } else {
            showNotification("Incorrect login details")
            return null
        }

    }

})

export const refreshUser = createAsyncThunk("refreshUser", async (_, thunkAPI) => {
   const state = thunkAPI.getState().userSlice.user
    const { data, error } = await supabase.from("user").select().eq('user_id', state.user_id).single()
    return data
})
const main = localStorage.getItem("precision")
const initialState = {
    isLoading: false,
    isChange: false,
    register: JSON.parse(main) ||{
        user_id: '',
        fullname: '',
        email: '',
        password: '',
        username: '',
        role: 'tutor',
        location: '',
        exams_id: [],
        results_id: [],
        contact: "",
        user_img_name: '',
    },
    login: { email: '', password: '' },
    user: JSON.parse(main) || {}
}
const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeInput: (state, action) => {
            const { name, value, act } = action.payload
            state[act] = { ...state[act], [name]: value }

        },
        setIsLoading: (state, action) => {
            return { ...state, isLoading: !state.isLoading }
        },
        logOut: (state, action) => {
            localStorage.removeItem("precision")
            return {
                ...state, user: {}, register: {
                    user_id: '',
                    fullname: '',
                    email: '',
                    password: '',
                    username: '',
                    role: 'tutor',
                    location: '',
                    exams_id: [],
                    results_id: [],
                    contact: "",
                    user_img_name: '',
                } }
        },
        setIsChange: (state, action) => {
            state.isChange = false
        }, setUserDefault: (state, action) => {
            return {
                ...state, isLoading: false,
                isChange: false,
                login: { email: '', password: '' }
                ,user: {}, register: {
                    user_id: '',
                    fullname: '',
                    email: '',
                    password: '',
                    username: '',
                    role: 'tutor',
                    location: '',
                    exams_id: [],
                    results_id: [],
                    contact: "",
                    user_img_name: '',
                }
            }
            
        }

    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state, action) => {
            return { ...state, isLoading: true }
        }).addCase(registerUser.fulfilled, (state, action) => {
            const user = action.payload

            const item = JSON.stringify(user)
            localStorage.setItem("precision", item)
            const register = {
                user_id: '',
                fullname: '',
                email: '',
                password: '',
                username: '',
                role: 'tutor',
                location: '',
                exams_id: [],
                results_id: [],
                contact: 0,
                user_img_name: '',
            }
            return { ...state, user, isLoading: false, register }
        }).addCase(loginUser.pending, (state, action) => {
            return { ...state, isLoading: true }
        }).addCase(loginUser.fulfilled, (state, action) => {

            const user = action.payload
            if (user === 'null') return { ...state, isLoading: false }
            const item = JSON.stringify(user)
            localStorage.setItem("precision", item)
            const login = { email: '', password: '' }
            return { ...state, isLoading: false, user, login }
        }).addCase(updateUser.pending, (state, action) => {
            state.isLoading = true
        }).addCase(updateUser.fulfilled, (state, action) => {
            const user = action.payload
            state.user = user
            const item = JSON.stringify(user)
            localStorage.setItem("precision", item)
            const register = {
                user_id: '',
                fullname: '',
                email: '',
                password: '',
                username: '',
                role: 'tutor',
                location: '',
                exams_id: [],
                results_id: [],
                contact: 0,
                user_img_name: '',
            }
            // state.register = register
            state.isLoading = false
            state.isChange = true
        }).addCase(refreshUser.pending, (state, action) => {
            localStorage.removeItem("precision")
            state.isLoading = true
        }).addCase(refreshUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload
            const item = JSON.stringify(action.payload)
            localStorage.setItem("precision", item)
            
        }).addCase(refreshUser.rejected, (state, action) => {
            state.isLoading = false
        })


    }


})
export const {setUserDefault, changeInput, logOut, setIsLoading, setIsChange } = user.actions
export const { reducer: userSlice } = user