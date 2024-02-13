import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Users {
    name: string;
    isLog: boolean;
}

const INITIAL_STATE: Users[] = [
    {name: "User", isLog: false}
]

const userLoggin = createSlice({
    name: "users",
    initialState: INITIAL_STATE,
    reducers:{
        addUser(state, {payload}: PayloadAction<string>){
            return state.map((st) =>
                st.name === "User" ? {...st, isLog: !st.isLog} : st
            );
        },
    },
})

export default userLoggin.reducer;
export const { addUser } = userLoggin.actions;
export const userLog = (state:any) =>{
    return state.user as Users[];
}
