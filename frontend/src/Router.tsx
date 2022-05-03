import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import App from 'pages/app/App';
import Top from 'pages/top/Top';
import NotFound from 'pages/notFound/NotFound';
const Chat = lazy(() => import('pages/chat/Chat'));

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Top />} />
                <Route path="/app" element={<App />} />
                <Route path="/chat" element={
                    <Suspense fallback={<p>Loading...</p>}>
                        <Chat />
                    </Suspense>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;