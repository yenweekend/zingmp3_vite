import { Route, Routes } from "react-router-dom";
import Master from "./layouts/Master";
import paths from "./utils/paths";
import { useEffect } from "react";
import DefaultRoute from "./components/Route/DefaultRoute";
import {
  Home,
  Album,
  SingerProfile,
  Zingchart,
  Hub,
  HubDetail,
  SocialBoard,
  All,
  SongsSearch,
  MVSearch,
  ArtistsSearch,
  AlbumSearch,
  Videos,
  History,
  HistoryMV,
  HistoryPlaylist,
  HistorySong,
  Favorite,
  FavoriteMV,
  FavoritePlaylist,
  FavoriteSong,
  PlaylistCollect,
  PlaylistLibrary,
  PlaylistOwner,
  Playlist,
  Login,
  Register,
} from "./pages";
import setAuthToken from "./services/setAuthToken";
import { useDispatch } from "react-redux";
import { setAccount } from "./redux/auth/slice";
import RedirectRoute from "./components/Route/RedirectRoute";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const authToken = localStorage.getItem("auth-token");
    if (authToken && authToken.trim().length != 0) {
      setAuthToken(authToken);
    }
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth != null) {
      dispatch(setAccount(auth));
    } else {
      dispatch(setAccount({ isLogin: false, username: null }));
    }
    const themeUI = JSON.parse(localStorage.getItem("theme"));
    if (!themeUI || themeUI.theme.trim().length === 0) {
      document.documentElement.className = "light";
      localStorage.setItem(
        "theme",
        JSON.stringify({
          title: "Sáng",
          bg_theme:
            "https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/theme/light.jpg",
          theme: "light",
        })
      );
    } else {
      document.documentElement.className = themeUI.theme;
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path={paths.VIDEO} element={<Videos />}></Route>
        <Route
          path={"/auth/login"}
          element={
            <RedirectRoute>
              <Login />
            </RedirectRoute>
          }
        ></Route>
        <Route
          path={"/auth/register"}
          element={
            <RedirectRoute>
              <Register />
            </RedirectRoute>
          }
        ></Route>
        <Route path={paths.PUBLIC} element={<Master />}>
          <Route path={paths.HOME} element={<Home />}></Route>
          <Route path={paths.ALBUM} element={<Album />}></Route>
          <Route path={paths.PLAYLIST} element={<Playlist />}></Route>
          <Route path={paths.MUSICIER} element={<SingerProfile />}></Route>
          <Route path={paths.ZINGCHART} element={<Zingchart />}></Route>
          <Route path={paths.HUB} element={<Hub />}></Route>
          <Route path={paths.HUBDETAIL} element={<HubDetail />}></Route>
          <Route path={paths.NEWRELEASE} element={<SocialBoard />}></Route>
          <Route path={paths.AllRESULT} element={<All />}></Route>
          <Route path={paths.SONGS} element={<SongsSearch />}></Route>
          <Route path={paths.PLAYLISTSEARCH} element={<AlbumSearch />}></Route>
          <Route path={paths.MVSEARCH} element={<MVSearch />}></Route>
          <Route path={paths.ARTISTSEARCH} element={<ArtistsSearch />}></Route>
          <Route path={paths.HISTORY} element={<History />}>
            <Route
              index
              element={<DefaultRoute route={paths.HISTORYPLAYLIST} />}
            />
            <Route path={paths.HISTORYMV} element={<HistoryMV />}></Route>
            <Route
              path={paths.HISTORYPLAYLIST}
              element={<HistoryPlaylist />}
            ></Route>
            <Route path={paths.HISTORYSONG} element={<HistorySong />}></Route>
          </Route>
          <Route path={paths.FAVORITE} element={<Favorite />}>
            <Route
              index
              element={<DefaultRoute route={paths.FAVORITESONG} />}
            />
            <Route path={paths.FAVORITEMV} element={<FavoriteMV />}></Route>
            <Route path={paths.FAVORITESONG} element={<FavoriteSong />}></Route>
            <Route
              path={paths.FAVORITEPLAYLIST}
              element={<FavoritePlaylist />}
            ></Route>
          </Route>
          <Route path={paths.MYLIBRARY} element={<PlaylistLibrary />}>
            <Route index element={<DefaultRoute route={paths.MYPLAYLIST} />} />
            <Route
              path={paths.MYOWNPLAYLIST}
              element={<PlaylistOwner />}
            ></Route>
            <Route
              path={paths.MYPLAYLIST}
              element={<PlaylistCollect />}
            ></Route>
          </Route>
          <Route path="/*" element={<Home />}></Route>
        </Route>
      </Routes>
    </>
  );
}
export default App;
