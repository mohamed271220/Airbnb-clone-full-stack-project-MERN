import React, { useContext, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext'
import { Link } from 'react-router-dom';
import axios from 'axios';
import PlacePage from './PlacePage';
import Nav from '../nav';


const Account = () => {
    const [toHomePage, setToHomePage] = useState(null)
    const { user, ready, setUser } = useContext(UserContext);


    let { subpage } = useParams();
    console.log(subpage);
    if (subpage === undefined) {
        subpage = 'profile';
    }
    async function logout() {
        await axios.post('/logout');
        setToHomePage('/');
        setUser(null);

    }

    if (!ready) {
        return 'Loading'
    }
    
    
    
    if (toHomePage) {
        return <Navigate to={toHomePage} />
    }
    
    if (ready && !user && !toHomePage) {
        return <Navigate to={'/login'} />
    }
    return (
        <div>
<Nav/>
            {subpage === 'profile' && (
                <div className='text-center max-w-lg mx-auto' >
                    Logged in as {user.name} ({user.email})
                    <button className='primary max-w-sm mt-2' onClick={logout}>Logout</button>
                </div>
            )}

            {subpage === 'places' && (
                <PlacePage></PlacePage>
            )}
        </div>
    )
}

export default Account