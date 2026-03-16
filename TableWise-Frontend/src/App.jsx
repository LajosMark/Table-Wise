import { useEffect, useState } from 'react';
import './App.css'
import Menu from './pages/Menu'
import { BrowserRouter, Routes, Route, useActionData } from "react-router";

function App() {
  const [foodcategories, setFoodcategories] = useState([])
  const mealCategoriesfetch = "http://localhost:3000/api/mealcategories"

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch(mealCategoriesfetch)
    const data = await res.json()
    setFoodcategories(data)
  };

  return (
    <>
      <BrowserRouter>
        {/* <h1>Ez minden oldalon meg fog jelenni.</h1>
        <a className="btn btn-primary" href="/add-auto" role="button">Add Auto</a> */}
        <Routes>
          <Route path='/' element={<Menu foodcategories={foodcategories} mealCategoriesfetch={mealCategoriesfetch} name='Étlap'/>} />
          {/* <Route path='/add-auto' element={<AddAuto fetchData={fetchData} />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
