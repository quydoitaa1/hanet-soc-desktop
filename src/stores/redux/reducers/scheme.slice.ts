import { MonitorConfig, Scheme, SchemeFieldFormValues } from '@/types/scheme.type';
import socketConnection from '@/utils/socketConnection';
import { AsyncThunk, PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { notification } from 'antd';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

const KEY = 'crud';

const initialFormValues: SchemeFieldFormValues = {
    name: '',
    description: '',
    monitorConfigList: [],
    camsList: [],
    conditionalCamList: [],
    interval: 3000
};

interface SchemeState {
    schemesList: Scheme[];
    loading: boolean;
    currentRequestId: string | null;
    deleteSchemeId: string | null;
}

const initialState: SchemeState = {
    schemesList: [],
    loading: false,
    currentRequestId: null,
    deleteSchemeId: null
};

export const getSchemesList = createAsyncThunk('scheme/gets', async (_, thunkAPI) => {
    try {
        const response = await socketConnection.callSocketApi(KEY, 'findAllScreen', {});

        return response as Scheme[];
    } catch (error) {
        console.log(error);

        return thunkAPI.rejectWithValue({
            error
        });
    }
});

export const getScheme = createAsyncThunk('scheme/get', async (schemeId: string, thunkAPI) => {
    try {
        const response = await socketConnection.callSocketApi(KEY, 'findOneScreen', {
            id: schemeId
        });
        return response as Scheme;
    } catch (error) {
        return thunkAPI.rejectWithValue({
            error
        });
    }
});

export const addScheme = createAsyncThunk(
    'scheme/add',
    async (body: SchemeFieldFormValues, thunkAPI) => {
        const { monitorConfigList, camsList, conditionalCamList, interval, ...props } = body;

        const newSheme = {
            ...props,
            detail: {
                monitorConfigList,
                camsList,
                conditionalCamList,
                interval
            }
        };

        try {
            const response = await socketConnection.callSocketApi(KEY, 'createScreen', newSheme);
            return response as Scheme;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error
            });
        }
    }
);
export const updateScheme = createAsyncThunk(
    'scheme/update',
    async (payload: { id: string; body: SchemeFieldFormValues }, thunkAPI) => {
        try {
            const { monitorConfigList, camsList, conditionalCamList, interval, ...props } =
                payload.body;
            const updateData = {
                ...props,
                id: +payload.id,
                detail: {
                    monitorConfigList,
                    camsList,
                    conditionalCamList,
                    interval
                }
            };

            const response = await socketConnection.callSocketApi(KEY, 'updateScreen', updateData);
            return response as Scheme;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error
            });
        }
    }
);

export const deleteScheme = createAsyncThunk(
    'scheme/delete',
    async (schemeId: string, thunkAPI) => {
        try {
            const response = await socketConnection.callSocketApi(KEY, 'deleteScreen', {
                id: schemeId
            });
            return response as string;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error
            });
        }
    }
);

const schemeSlice = createSlice({
    name: 'scheme',
    initialState,
    reducers: {
        startDeleteScheme: (state, action: PayloadAction<string>) => {
            state.deleteSchemeId = action.payload;
        },
        finishDeleteScheme: (state) => {
            state.deleteSchemeId = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getSchemesList.fulfilled, (action, state) => {
                action.schemesList = state.payload;
            })
            .addMatcher<PendingAction>(
                (action) => action.type.startsWith('scheme') && action.type.endsWith('/pending'),
                (state, action) => {
                    state.loading = true;
                    state.currentRequestId = action.meta.requestId;
                }
            )
            .addMatcher<RejectedAction | FulfilledAction>(
                (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
                (state, action) => {
                    const { requestId } = action.meta;
                    if (requestId === state.currentRequestId) {
                        state.loading = false;
                        state.currentRequestId = null;
                    }
                }
            );
    }
});

export const { startDeleteScheme, finishDeleteScheme } = schemeSlice.actions;

const scheme = schemeSlice.reducer;

export default scheme;
