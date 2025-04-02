import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthContextProvider } from './context/AuthContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  
    <BrowserRouter> 
      <AuthContextProvider>
          <App />
      </AuthContextProvider>
    </BrowserRouter>
 
);
