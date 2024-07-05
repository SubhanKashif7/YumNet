
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter  , RouterProvider} from 'react-router-dom'
import App from './App';
import Home from './components/Home';

const browserRouter = createBrowserRouter([
  {
    path : "/",
    element : <App/>,
    children : [
      {
        path : "",
        element : <Home/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={browserRouter}/>
)
