import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../../services/api';
import socketio from 'socket.io-client';
import './styles.css';

export default function DashBoard(){
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(()=>{
        const user_id = localStorage.getItem('user');
        const socket = socketio('http://localhost:3333', {
            query:{user_id},
        });
      
        socket.on('booking_request', data=>{
            console.log(data);
        })

    }, []);

    useEffect(() => {
        async function loadSpots(){
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: {user_id}
            });
            setSpots(response.data);
        }
        loadSpots();
    },[]);
    return (
        <>
        <ul className="notifications">
        {requests.map(request => (
            <li key = {request._id}>
                <p>
                    <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data <strong>{request.date}</strong>
                </p>

            </li>
        ))}
        </ul>

        <ul className="spot-list">
            {spots.map(spot => (
                <li key={spot._id}>
                   <header style={ { backgroundImage: `url(${spot.thumbnail_url})`} } />
                    <strong>{spot.company}</strong>
                    <span>{spot.price ?  `R$${spot.price}/dia` : 'GRATUITO'}</span>
                </li>
            ))}
        </ul>
        <Link to="/new">
            <button className="btn"> Cadastrar novo spot</button>            
        </Link>
        </>
    )
}