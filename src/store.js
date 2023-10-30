import { configureStore } from "@reduxjs/toolkit";
import  adminNotification  from "./redux/reducer";

const store = configureStore({
    reducer:{
        adminNotification :adminNotification,
    },
});

export default store;

