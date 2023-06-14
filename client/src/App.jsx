import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import Account from './pages/Account'
import PlacePage from './pages/PlacePage'
import PlaceFormPage from './pages/PlaceFormPage'
import PlaceSinglePage from './pages/PlaceSinglePage'
import BookingsPage from './pages/BookingsPage'
import BookingPage from './pages/BookingPage'

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0)


  return (

    //routing
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Account/places" element={<PlacePage />} />
          <Route path="/Account/places/new" element={<PlaceFormPage />} />
          <Route path="/Account/places/:id" element={<PlaceFormPage />} />
          <Route path="/places/:id" element={<PlaceSinglePage />} />
          <Route path="/Account/bookings" element={<BookingsPage />} />
          <Route path="/Account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>


  )
}

export default App
