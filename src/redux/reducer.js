import { createSlice } from '@reduxjs/toolkit'
const initialState = {
 notificationUpdate:false,
 pageNumber:0,
 rowPerPageCount:10,
};
export const adminNotification = createSlice({
    name: "adminNotification",
    initialState,
    reducers: {
       
        setNotificationUpdate(state, action) {
            state.notificationUpdate = action.payload
        },
        setPageNumber(state, action){
            state.pageNumber = action.payload
        },
        setRowPerPageCount(state, action){
            state.rowPerPageCount = action.payload
        },
    },
})
export const { setNotificationUpdate, setPageNumber, setRowPerPageCount} = adminNotification.actions;

export default adminNotification.reducer;



