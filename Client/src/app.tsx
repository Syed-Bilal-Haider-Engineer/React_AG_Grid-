import { Route, Routes } from 'react-router-dom';
import { DataGrid } from './Components/DataGrid';
import ViewCar from './Components/ViewDetails';

const App = () => (
  <Routes>
    <Route path="/" element={<DataGrid />} />
    <Route path="/view/:id" element={<ViewCar />} />
  </Routes>
);

export default App;
