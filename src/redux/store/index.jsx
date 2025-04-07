import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import queueSongReducer from "../queueSong/slice";
import authReducer from "../auth/slice";
import collectionReducer from "../collection/slice";
import songReducer from "../song/slice";

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconciler: autoMergeLevel2,
};
const keywordPersistConfig = {
  ...persistConfig,
  key: "keyword",
};
const queueSongPersistConfig = {
  ...persistConfig,
  key: "queue_song",
};
const audioSongPersistConfig = {
  ...persistConfig,
  key: "audio",
};

const store = configureStore({
  reducer: {
    queueSong: persistReducer(queueSongPersistConfig, queueSongReducer),
    songState: songReducer,
    account: authReducer,
    collection: collectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});
const persistor = persistStore(store);
export { store, persistor };
