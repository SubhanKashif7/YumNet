
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter  , RouterProvider} from 'react-router-dom'
import App from './App';

import SignIn from './components/Auth/SignIn';

const browserRouter = createBrowserRouter([
  {
    path : "/",
    element : <App/>,
    children : [
      {
        path : "",
        element : <SignIn/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={browserRouter}/>
)
