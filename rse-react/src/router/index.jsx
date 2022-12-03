import App from "../App";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import routes from './routes'

const BaseRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/u" element={ <Navigate to='/' /> } />
        { routes.map(({ _, url, page }) => <Route path={url} element={page} />) }
      </Route>
    </Routes>
  </BrowserRouter>
);

export default BaseRouter;