import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import PlaceGallery from '../PlaceGallery';

const BookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null)
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id)
        if (foundBooking) {
          setBooking(foundBooking);
        }
      })
    }

  }, [id])

  if (!booking) {
    return '';
  }

  return (
    <div>
      <div className='mt-4 bg-gray-100 -mx-8 px-8 pt-8'>
            <h1 className='text-3xl'>{booking.place.title}</h1>
            <a className='block flex my-3 gap-1 font-semibold' target='_blank' href={'https://maps.google.com/?q=' + booking.place.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {booking.place.address}
            </a>
      <PlaceGallery place={booking.place}/>
    </div>
    </div>
  )
}

export default BookingPage