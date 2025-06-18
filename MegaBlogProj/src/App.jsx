import React,{useState, useEffect} from 'react'
import {useDispatch} from  'react-redux'
import './App.css'
import authService from './appwrite/auth.js'
import {login, logout} from "./store/authSlice" 
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import { Outlet } from 'react-router-dom'

function App() {
    
    
  const [loading, setLoading]= useState(true)
  const dispatch= useDispatch()

  useEffect(() => {

    authService.getCurrentUser()
    .then((userData) => {
      // console.log("User data from Appwrite:", userData);
      if(userData){
        dispatch(login({userData}))
      }else{
        dispatch(logout())
      }

    })
    .finally(() => setLoading(false))

  }, [])


  // return !loading ? (
  //   <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
  //     <div className='w-full block'>
  //       <Header/>
  //       <main>
  //         <Outlet/>
  //       </main>
  //       <Footer/>
  //     </div>
  //   </div>
  // ) : null

  if (loading) {
     return <div className="text-center p-10 text-lg">Loading...</div>;
  }

  return (
   <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
    <div className='w-full block'>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </div>
   </div>
  )
}

export default App
