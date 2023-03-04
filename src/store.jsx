import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./Model/userSlice";
import { examSlice } from "./Model/ExamSlice";


export const store = configureStore({
    reducer: {
        userSlice,
        examSlice
    }
 
})

// user/changeInput