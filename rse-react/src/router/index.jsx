import App from "../App";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import routes from './routes'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "u", element: <Navigate to='/' />, },
      ...routes.map(({ _, url, page }) => ({path: url, element: page}))
    ],
  },
]);

const BaseRouter = () => (
  <RouterProvider router={router} />
);

export default BaseRouter;