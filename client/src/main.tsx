import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'
import { Toaster } from '../src/components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <Toaster />
  </>
);