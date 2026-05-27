import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/store/index';
import './index.css';
import App from './App.jsx';

// ============================================================
// ENTRY POINT - Bọc toàn bộ app với các Provider cần thiết:
//   - BrowserRouter : Cung cấp context cho React Router
//   - Provider      : Cung cấp Redux store cho toàn bộ component tree
// ============================================================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
