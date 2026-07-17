const SEARCH_URL = "https://striveschool-api.herokuapp.com/api/deezer/search";

export async function searchTracks(query) {
  const response = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Errore nella ricerca dei brani");
  }
  const { data } = await response.json();
  return data;
}
