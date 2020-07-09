import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    count: number;
}

const initialState: CounterState = { count: 0 }

const counterSlice = createSlice({
    name: 'counter',
    initialState: initialState,
    reducers: {
        increment: (state, action: PayloadAction<number>) => {
            state.count += action.payload;
        },
        decrement: (state, action: PayloadAction<number>) => {
            state.count -= action.payload;
        }
    }
});

export const increment = counterSlice.actions.increment;
export const decrement = counterSlice.actions.decrement;

export default counterSlice.reducer