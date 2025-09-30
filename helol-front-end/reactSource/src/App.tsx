// App.tsx
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home.tsx'
import Complain from './pages/Complain.tsx'
import AnalyticsDashboard from './pages/AnalyticsDashboard.tsx'
import NavBar from './components/NavBar.tsx'
import './css/App.css'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/complain" element={<Complain />}/>
        <Route path="/analytics" element={<AnalyticsDashboard />}/>

      </Routes>
    </>
  );
}

export default App;
