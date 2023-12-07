import './App.css';
// import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ContentProvider } from './Context/ContentProvider';
import { LoadingProvider } from './Context/LoadingProvider';
import { MenuProvider } from './Context/MenuProvider';
import { ModalProvider } from './Context/ModalProvider';
import { TopicProvider } from './Context/TopicProvider';
import { UserProvider } from './Context/UserProvider';
import Main from './Main';

// import { useLocalState } from './util/useLocalStorage';

function App(): JSX.Element {
  return (
    <>

      <LoadingProvider>
        <TopicProvider>
          <ContentProvider>
            <UserProvider>
              <ModalProvider>
                <MenuProvider>
                  <Routes>
                    <Route index element={ <Navigate to="/category/1" />} />
                    <Route path="/category/:catId" element={ <Main/> } />
                    <Route path="/posts/:postId" element={ <Main/> } />
                    <Route path="/profile/:profileId" element={ <Main/> } />
                    <Route path="/terms-and-conditions" element={ <Main/> } />
                    <Route path="/privacy-policy" element={ <Main/> } />
                    <Route path="/notifications" element={ <Main/> } />
                    <Route path="/bookmarks" element={ <Main/> } />
                    <Route path="*" element={ <Main notFound={true}/> } />
                  </Routes>
                </MenuProvider>
              </ModalProvider>
            </UserProvider>
          </ContentProvider>
        </TopicProvider>
      </LoadingProvider>
    </>
  );
}

export default App;
