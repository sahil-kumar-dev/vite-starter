import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoutes from './components/shared/ProtectedRoutes';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <ProtectedRoutes>
            <p>Hello inital Project setup</p>
          </ProtectedRoutes>}
        />
      </Routes>
    </>
  )
}

export default App
