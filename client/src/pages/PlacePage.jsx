
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Nav from '../nav'
import PlaceFormPage from './PlaceFormPage'
// import PhotosUploader from '../PhotosUploader'
const PlacePage = () => {
    // const { action } = useParams()


    // function inputHeader(text) {
    //     return (
    //         //the header and the txt with in it 
    //         pass
    //         )
    //     }
    //     function preInput(header, des) {
    //         return (
    //             pass
    //             )
    //         }


    // const [redirectToPlacesList, setRedirectToPlacesList] = useState(false)

    // if (redirectToPlacesList && action !== 'new') {
    //     return <Navigate to={'/account/places'} />
    // }
    const [places, setPlaces] = useState([])
    useEffect(() => {
        axios.get('/user-places').then(({ data }) => {
            setPlaces(data);
        })
    }, [])
    return (
        <div>
            <Nav />
            <div className='text-center'>
                <Link
                    className='bg-primary text-white py-2 px-6 rounded-full gap-1 inline-flex'
                    to={'/account/places/new'} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    Add new place
                </Link>
            </div>
            <div className='mt-4'>
                {places.length > 0 && places.map(place => (
                    <Link to={'/account/places/'+place._id} className='flex cursor-pointer p-4 gap-4 rounded-2xl bg-gray-100'>
                        <div className='flex w-32 h-32 bg-gray-300 shrink-0'>
                            {place.photos.length > 0 && (
                                <img 
                                className='object-cover'
                                src={'http://localhost:4000/'+place.photos[0]} alt="" />
                            )}
                        </div>
                        <div className='grow-0 shrink'>
                        <h2 className='text-xl'>
                            {place.title}
                        </h2>
                        <p className='text-sm mt-2'>{place.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>


    )
}

export default PlacePage