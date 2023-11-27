import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './containers/page.home';
import Login from './containers/page.login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

