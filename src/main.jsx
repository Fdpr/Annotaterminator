import { StrictMode, React } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import 'rsuite/styles/index.less';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
