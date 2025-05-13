import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['persist/PERSIST'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt'],
                // Ignore these paths in the state
                ignoredPaths: ['auth.user.createdAt', 'auth.user.updatedAt'],
            },
        }),
});

export default store; 