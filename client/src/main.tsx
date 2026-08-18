import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../app/App';
import { store } from '../app/providers/store';
import '../app/styles/global.css'

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <Provider store={store}>
         <BrowserRouter>
            <App />
         </BrowserRouter>
      </Provider>
   </StrictMode>,
);