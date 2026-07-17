import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchTracks } from "../api/deezer";

// Thunk asincrono: cerca brani su Deezer tramite il proxy Strive
export const fetchSearchResults = createAsyncThunk(
  "music/fetchSearchResults",
  (query) => searchTracks(query)
);

const initialState = {
  searchQuery: "",
  searchResults: [],
  currentTrack: null,
  favorites: [], // array di ID brano
  isLoading: false,
  isError: false,
};

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetSearch: (state) => {
      state.searchQuery = "";
      state.searchResults = [];
      state.isError = false;
    },
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    toggleFavorite: (state, action) => {
      const id = action.payload;
      const index = state.favorites.indexOf(id);
      if (index === -1) {
        state.favorites.push(id);
      } else {
        state.favorites.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setSearchQuery, resetSearch, setCurrentTrack, toggleFavorite } =
  musicSlice.actions;

export default musicSlice.reducer;
