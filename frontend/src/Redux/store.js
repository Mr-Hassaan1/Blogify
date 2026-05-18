import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import blogSlice from "./blogSlice";
import themeSlice from "./themeSlice"
// import commentSlice from "./commentSlice"

import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/es/storage'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const rootReducer = combineReducers({
    theme: themeSlice,
    auth: authSlice,
    blog: blogSlice,
    // comment:commentSlice,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
export default store;