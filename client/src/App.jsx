import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import DrawPage from './pages/DrawPage.jsx';
import AquariumPage from './pages/AquariumPage.jsx';

export default function App() {
  return (
    <>
      <NavBar />
      <main className='page'>
        <Routes>
          <Route path='/' element={<DrawPage />} />
          <Route path='/aquarium' element={<AquariumPage />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </main>
    </>
  );
}