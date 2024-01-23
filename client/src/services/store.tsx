import {configureStore} from '@reduxjs/toolkit';
import userLoggin from './reduce';

const store = configureStore({
    reducer: {
        user: userLoggin,
    },
})

export default store;