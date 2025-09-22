import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests

// --- CSS Styles ---
const StyleProvider = () => (
    <style>{`
        /* --- General & Body --- */
        #root {
            width: 100%; /* Force the root element to take full width */
        }
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            color: #1f2937;
            box-sizing: border-box;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        .app-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            width: 100%;
        }
        main {
            flex-grow: 1;
            width: 100%;
        }

        /* --- Animations --- */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }

        /* --- Header --- */
        .header {
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
            z-index: 40;
            padding: 0.75rem 0;
        }
        .nav-container {
            max-width: 1280px;
            margin: auto;
            padding: 0 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: #2563eb;
            background: none;
            border: none;
            cursor: pointer;
        }
        .desktop-nav { display: none; }
        .header-buttons-desktop { display: none; }
        
        @media (min-width: 768px) {
            .desktop-nav {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background-color: #f3f4f6;
                padding: 0.25rem;
                border-radius: 0.5rem;
            }
            .header-buttons-desktop {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
        }
        .header-buttons-desktop button, .user-info button {
            font-size: 0.875rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            transition: background-color 0.3s;
            border: none;
            cursor: pointer;
        }
        .login-btn {
             background-color: transparent;
             color: #4b5563;
        }
        .login-btn:hover { background-color: #f3f4f6; }
        .signup-btn, .logout-btn {
            background-color: #2563eb;
            color: white;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .signup-btn:hover, .logout-btn:hover { background-color: #1d4ed8; }
        .mobile-menu-btn { display: block; background: none; border: none; cursor: pointer; }
        @media (min-width: 768px) {
            .mobile-menu-btn { display: none; }
        }
        .mobile-menu {
             padding: 0.5rem 1rem 1rem;
             border-top: 1px solid #e5e7eb;
        }
        
        .user-info { display: none; }
        @media (min-width: 768px) {
            .user-info { 
                display: flex;
                align-items: center;
                gap: 1rem;
            }
        }
        .user-info span { font-weight: 500; }

        /* --- Hero Section, Booking Section, etc. --- */
        /* ... (previous styles remain the same) ... */
        .hero-section { height: 70vh; display: flex; align-items: center; justify-content: center; color: white; text-align: center; background-size: cover; background-position: center; }
        .hero-section h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .hero-section p { font-size: 1.125rem; margin-bottom: 2rem; max-width: 42rem; margin-left: auto; margin-right: auto; }
        @media(min-width: 768px) { .hero-section h1 { font-size: 3.75rem; } .hero-section p { font-size: 1.25rem; } }
        .booking-section-container { background-color: transparent; padding: 3rem 1rem; margin-top: -6rem; position: relative; z-index: 10; }
        .booking-form-wrapper { max-width: 896px; margin: auto; border-radius: 0.75rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); background-color: rgba(255,255,255,0.8); backdrop-filter: blur(4px); }
        .booking-tabs { display: flex; flex-direction: column; border-bottom: 1px solid #e5e7eb; border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; overflow: hidden; }
        @media(min-width: 640px) { .booking-tabs { flex-direction: row; } }
        .booking-tab { padding: 0.75rem 1rem; width: 100%; font-weight: 600; display: flex; align-items: center; justify-content: center; transition: all 0.3s; border: none; cursor: pointer; background-color: transparent; border-bottom: 2px solid transparent; }
        .booking-tab.active { color: #2563eb; border-bottom-color: #2563eb; }
        .booking-tab:not(.active) { color: #6b7280; }
        .booking-tab:not(.active):hover { background-color: #f9fafb; }
        .form-grid { padding: 1.5rem; display: grid; gap: 1rem; align-items: flex-end; }
        .form-group { width: 100%; }
        .form-label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
        .form-input { display: block; width: 100%; border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .form-input:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5); }
        .submit-btn { width: 100%; background-color: #2563eb; color: white; font-weight: bold; padding: 0.75rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: background-color 0.3s; }
        .submit-btn:hover { background-color: #1d4ed8; }
        .submit-btn:disabled { background-color: #9ca3af; cursor: not-allowed; }
        @media (min-width: 768px) { .form-grid.flights-grid, .form-grid.hotels-grid { grid-template-columns: repeat(2, 1fr); } .form-grid.cabs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .form-grid.flights-grid { grid-template-columns: repeat(5, 1fr); } .flights-grid .form-group:nth-child(1), .flights-grid .form-group:nth-child(2), .flights-grid .form-group:nth-child(4) { grid-column: span 2; } .flights-grid .form-group:nth-child(6) { grid-column: span 5; } .form-grid.hotels-grid { grid-template-columns: repeat(4, 1fr); } .hotels-grid .form-group:nth-child(1) { grid-column: span 2; } .hotels-grid .form-group:nth-child(5) { grid-column: span 4; } .form-grid.cabs-grid { grid-template-columns: repeat(4, 1fr); } .cabs-grid .form-group:nth-child(1), .cabs-grid .form-group:nth-child(2) { grid-column: span 2; } .cabs-grid .form-group:nth-child(4) { grid-column: span 4; } }
        .modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.6); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal-content { background-color: white; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); width: 100%; max-width: 24rem; }
        .results-container { max-width: 1280px; margin: auto; padding: 3rem 1.5rem; min-height: 60vh; }
        .hotel-card, .flight-card, .cab-card { background-color: white; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 1.5rem; transition: box-shadow 0.3s; overflow: hidden; }
        .hotel-card:hover, .flight-card:hover, .cab-card:hover { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .flight-card { padding: 1.5rem; display: flex; flex-direction: column; }
        .cab-card { padding: 1.5rem; display: flex; flex-direction: column; align-items: center; }
        @media(min-width: 768px) { .hotel-card, .flight-card, .cab-card { flex-direction: row; } .hotel-card img { width: 16rem; } .flight-card, .cab-card { align-items: center; justify-content: space-between; } }

        /* --- Auth Messages --- */
        .auth-error {
            background-color: #fee2e2;
            color: #b91c1c;
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            text-align: center;
        }
        .auth-success {
            background-color: #dcfce7;
            color: #166534;
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            text-align: center;
        }

    `}</style>
);


// --- Reusable Helper Components (No changes needed) ---
// ... (NavLink, MobileNavLink, DestinationCard components are the same)
const NavLink = ({ children, onClick, isActive }) => ( <button onClick={onClick} style={{ padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 500, transition: 'background-color 0.3s, color 0.3s', backgroundColor: isActive ? '#dbeafe' : 'transparent', color: isActive ? '#1e40af' : '#6b7280', border: 'none', cursor: 'pointer' }} onMouseOver={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f3f4f6'; }} onMouseOut={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}> {children} </button> );
const MobileNavLink = ({ children, onClick }) => ( <button onClick={onClick} style={{ display: 'block', width: '100%', textAlign: 'left', color: '#4b5563', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}> {children} </button> );
const DestinationCard = ({ image, name, properties }) => ( <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s', }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-0.5rem)'; e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.25)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'; }}> <img src={image} alt={name} style={{ width: '100%', height: '12rem', objectFit: 'cover', transition: 'transform 0.5s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} /> <div style={{ padding: '1rem' }}> <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1f2937' }}>{name}</h3> <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{properties} Properties</p> </div> </div> );


// --- Card Components for Search Results (No changes needed) ---
// ... (HotelCard, FlightCard, CabCard components are the same)
const HotelCard = ({ hotel }) => ( <div className="hotel-card"> <img style={{ height: 'auto', width: '100%', objectFit: 'cover' }} src={hotel.image} alt={hotel.name} /> <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}> <div> <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}> <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{hotel.name}</h3> <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', marginLeft: '1rem', flexShrink: 0 }}> <i className="fas fa-star" style={{ fontSize: '0.75rem', marginRight: '0.25rem' }}></i> {hotel.rating} </div> </div> <p style={{ color: '#4b5563', fontSize: '0.875rem', marginTop: '0.25rem' }}>{hotel.location}</p> </div> <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}> <div> <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Starting from</p> <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>${hotel.price}<span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: '#4b5563' }}>/night</span></p> </div> <button className="submit-btn" style={{width: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '0.5rem'}}>View Deal</button> </div> </div> </div> );
const FlightCard = ({ flight }) => ( <div className="flight-card"> <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', alignSelf: 'center' }}> <img src={flight.airline_logo} alt={flight.airline} style={{ height: '2.5rem', width: '2.5rem', marginRight: '1rem' }}/> <div> <p style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{flight.airline}</p> <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Round trip</p> </div> </div> <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '2rem', margin: '1rem 0' }}> <div> <p style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{flight.departure_time}</p> <p style={{ color: '#4b5563' }}>{flight.from_code}</p> </div> <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}> <i className="fas fa-plane"></i> <p>{flight.duration}</p> </div> <div> <p style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{flight.arrival_time}</p> <p style={{ color: '#4b5563' }}>{flight.to_code}</p> </div> </div> <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}> <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>${flight.price}</p> <button className="submit-btn" style={{ marginTop: '0.5rem', width: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>Select Flight</button> </div> </div> );
const CabCard = ({ cab }) => ( <div className="cab-card"> <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', alignSelf: 'flex-start' }}> <img src={cab.car_image} alt={cab.car_type} style={{ height: '4rem', width: '6rem', objectFit: 'contain', marginRight: '1rem' }}/> <div> <p style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{cab.car_type}</p> <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{cab.passengers} Passengers</p> </div> </div> <div style={{ textAlign: 'center', marginTop: '1rem' }}> <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>${cab.price}</p> <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Includes taxes & fees</p> <button className="submit-btn" style={{ marginTop: '0.5rem', width: 'auto', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>Book Now</button> </div> </div> );


// --- Page Components (No changes needed) ---
// ... (HomePage, SearchResultsPage components are the same)
const HomePage = ({ onSearch, setActiveTab, activeTab }) => { const heroStyle = { background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://placehold.co/1920x1080/0d2235/FFFFFF?text=Explore+the+World')`, }; const handleSearch = (e, page) => { e.preventDefault(); onSearch(page); }; return ( <> <section style={heroStyle} className="hero-section"> <div style={{padding: '0 1rem'}}> <h1>Your Journey Starts Here</h1> <p>Discover and book flights, hotels, and cabs with unparalleled ease and confidence.</p> </div> </section> <section className="booking-section-container"> <div className="booking-form-wrapper"> <div className="booking-tabs"> <button className={`booking-tab ${activeTab === 'flights' ? 'active' : ''}`} onClick={() => setActiveTab('flights')}> <i className="fas fa-plane" style={{marginRight: '0.5rem'}}></i>Flights </button> <button className={`booking-tab ${activeTab === 'hotels' ? 'active' : ''}`} onClick={() => setActiveTab('hotels')}> <i className="fas fa-hotel" style={{marginRight: '0.5rem'}}></i>Hotels </button> <button className={`booking-tab ${activeTab === 'cabs' ? 'active' : ''}`} onClick={() => setActiveTab('cabs')}> <i className="fas fa-taxi" style={{marginRight: '0.5rem'}}></i>Cabs </button> </div> {activeTab === 'flights' && ( <form onSubmit={(e) => handleSearch(e, 'flights')} className="form-grid flights-grid animate-fade-in"> <div className="form-group"> <label htmlFor="from" className="form-label">From</label> <input type="text" id="from" placeholder="New York (JFK)" className="form-input" /> </div> <div className="form-group"> <label htmlFor="to" className="form-label">To</label> <input type="text" id="to" placeholder="London (LHR)" className="form-input" /> </div> <div className="form-group"> <label htmlFor="departure" className="form-label">Departure</label> <input type="date" id="departure" className="form-input" /> </div> <div className="form-group"> <label htmlFor="return" className="form-label">Return</label> <input type="date" id="return" className="form-input" /> </div> <div className="form-group"> <label htmlFor="passengers" className="form-label">Passengers</label> <input type="number" id="passengers" defaultValue="1" className="form-input" /> </div> <div className="form-group"> <button type="submit" className="submit-btn">Search Flights</button> </div> </form> )} {activeTab === 'hotels' && ( <form onSubmit={(e) => handleSearch(e, 'hotels')} className="form-grid hotels-grid animate-fade-in"> <div className="form-group"> <label htmlFor="destination" className="form-label">Destination</label> <input type="text" id="destination" placeholder="e.g. Paris" className="form-input" /> </div> <div className="form-group"> <label htmlFor="check-in" className="form-label">Check-in</label> <input type="date" id="check-in" className="form-input" /> </div> <div className="form-group"> <label htmlFor="check-out" className="form-label">Check-out</label> <input type="date" id="check-out" className="form-input" /> </div> <div className="form-group"> <label htmlFor="guests" className="form-label">Guests</label> <input type="number" id="guests" defaultValue="2" className="form-input" /> </div> <div className="form-group"> <button type="submit" className="submit-btn">Search Hotels</button> </div> </form> )} {activeTab === 'cabs' && ( <form onSubmit={(e) => handleSearch(e, 'cabs')} className="form-grid cabs-grid animate-fade-in"> <div className="form-group"> <label htmlFor="pickup" className="form-label">Pickup Location</label> <input type="text" id="pickup" placeholder="Current Location" className="form-input" /> </div> <div className="form-group"> <label htmlFor="drop" className="form-label">Drop Location</label> <input type="text" id="drop" placeholder="Destination" className="form-input" /> </div> <div className="form-group"> <label htmlFor="pickup-date" className="form-label">Pickup Date</label> <input type="date" id="pickup-date" className="form-input" /> </div> <div className="form-group"> <button type="submit" className="submit-btn">Search Cabs</button> </div> </form> )} </div> </section> <section id="destinations" style={{padding: '4rem 1rem', backgroundColor: '#f9fafb'}}> <div style={{maxWidth: '1280px', margin: 'auto'}}> <h2 style={{fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '0.5rem', color: '#1f2937'}}>Popular Destinations</h2> <p style={{textAlign: 'center', color: '#4b5563', marginBottom: '3rem'}}>Explore the world's most sought-after cities.</p> <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem'}}> <DestinationCard image="https://placehold.co/400x300/3498db/FFFFFF?text=Paris" name="Paris, France" properties="12,500+" /> <DestinationCard image="https://placehold.co/400x300/e74c3c/FFFFFF?text=Rome" name="Rome, Italy" properties="9,800+" /> <DestinationCard image="https://placehold.co/400x300/2ecc71/FFFFFF?text=Bali" name="Bali, Indonesia" properties="15,200+" /> <DestinationCard image="https://placehold.co/400x300/f1c40f/FFFFFF?text=Dubai" name="Dubai, UAE" properties="7,600+" /> </div> </div> </section> </> ); };
const SearchResultsPage = ({ page, results, onBack }) => { const pageTitle = page.charAt(0).toUpperCase() + page.slice(1); const renderContent = () => { if (!results || results.length === 0) { return ( <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center'}}> <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem'}}>No Results Found</h3> <p style={{color: '#4b5563'}}>Please try adjusting your search criteria.</p> </div> ); } switch(page) { case 'hotels': return results.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />); case 'flights': return results.map(flight => <FlightCard key={flight.id} flight={flight} />); case 'cabs': return results.map(cab => <CabCard key={cab.id} cab={cab} />); default: return null; } }; return ( <div className="results-container"> <button onClick={onBack} style={{marginBottom: '2rem', backgroundColor: 'white', color: '#1f2937', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'inline-flex', alignItems: 'center', border: '1px solid #d1d5db', cursor: 'pointer'}}> <i className="fas fa-arrow-left" style={{marginRight: '0.5rem'}}></i> New Search </button> <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem'}}>Available {pageTitle}</h1> <div className="animate-fade-in"> {renderContent()} </div> </div> ); };


// --- Mock Data (No changes needed) ---
// ... (mockHotels, mockFlights, mockCabs are the same)
const mockHotels = [ { id: 1, name: 'The Grand Plaza Hotel', location: 'New York, USA', rating: 4.8, price: 320, image: 'https://placehold.co/400x300/8e44ad/ffffff?text=Grand+Plaza' }, { id: 2, name: 'Ocean View Resort', location: 'Bali, Indonesia', rating: 4.9, price: 250, image: 'https://placehold.co/400x300/3498db/ffffff?text=Ocean+View' }, { id: 3, name: 'Parisian Charm Boutique', location: 'Paris, France', rating: 4.7, price: 290, image: 'https://placehold.co/400x300/c0392b/ffffff?text=Parisian+Charm' }, ];
const mockFlights = [ { id: 1, airline: 'Delta Airlines', airline_logo: 'https://placehold.co/40x40/0033a0/ffffff?text=D', from_code: 'JFK', to_code: 'LHR', departure_time: '08:30', arrival_time: '20:45', duration: '7h 15m', price: 650 }, { id: 2, airline: 'United Airlines', airline_logo: 'https://placehold.co/40x40/005daa/ffffff?text=U', from_code: 'JFK', to_code: 'LHR', departure_time: '10:00', arrival_time: '22:15', duration: '7h 15m', price: 680 }, { id: 3, airline: 'British Airways', airline_logo: 'https://placehold.co/40x40/e74c3c/ffffff?text=B', from_code: 'JFK', to_code: 'LHR', departure_time: '11:30', arrival_time: '23:45', duration: '7h 15m', price: 710 }, ];
const mockCabs = [ { id: 1, car_type: 'Standard Sedan', car_image: 'https://placehold.co/96x64/2c3e50/ffffff?text=Sedan', passengers: 4, price: 45 }, { id: 2, car_type: 'Luxury SUV', car_image: 'https://placehold.co/96x64/95a5a6/ffffff?text=SUV', passengers: 6, price: 75 }, { id: 3, car_type: 'Van', car_image: 'https://placehold.co/96x64/34495e/ffffff?text=Van', passengers: 8, price: 90 }, ];


// --- Authentication Modals ---
const AuthModal = ({ children, onClose }) => (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

const LoginContent = ({ onLogin, onClose, onSwitchToSignUp, authError, isLoading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ email, password });
    };

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Login</h2>
                <button onClick={onClose} style={{fontSize: '1.5rem', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer'}}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
                {authError && <div className="auth-error">{authError}</div>}
                <div className="form-group" style={{marginBottom: '1rem'}}>
                    <label className="form-label" htmlFor="login-email">Email Address</label>
                    <input className="form-input" type="email" id="login-email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group" style={{marginBottom: '1.5rem'}}>
                    <label className="form-label" htmlFor="login-password">Password</label>
                    <input className="form-input" type="password" id="login-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="submit-btn" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                <p style={{textAlign: 'center', fontSize: '0.875rem', color: '#4b5563', marginTop: '1rem'}}>
                    Don't have an account? <button type="button" onClick={onSwitchToSignUp} style={{fontWeight: 500, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>Sign Up</button>
                </p>
            </form>
        </>
    );
};

const SignUpContent = ({ onSignUp, onClose, onSwitchToLogin, authError, authSuccess, isLoading }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSignUp({ fullName, email, password });
    };

    return (
     <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Create Account</h2>
            <button onClick={onClose} style={{fontSize: '1.5rem', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer'}}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
            {authError && <div className="auth-error">{authError}</div>}
            {authSuccess && <div className="auth-success">{authSuccess}</div>}
            <div className="form-group" style={{marginBottom: '1rem'}}>
                <label className="form-label" htmlFor="signup-name">Full Name</label>
                <input className="form-input" type="text" id="signup-name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="form-group" style={{marginBottom: '1rem'}}>
                <label className="form-label" htmlFor="signup-email">Email Address</label>
                <input className="form-input" type="email" id="signup-email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label className="form-label" htmlFor="signup-password">Password</label>
                <input className="form-input" type="password" id="signup-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Create Account'}</button>
            <p style={{textAlign: 'center', fontSize: '0.875rem', color: '#4b5563', marginTop: '1rem'}}>
                Already have an account? <button type="button" onClick={onSwitchToLogin} style={{fontWeight: 500, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>Login</button>
            </p>
        </form>
    </>
    );
};


// --- Main Application Component ---

export default function App() {
    const [page, setPage] = useState('home');
    const [searchResults, setSearchResults] = useState([]);
    const [activeTab, setActiveTab] = useState('flights');
    const [modalView, setModalView] = useState(null);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // New state for authentication
    const [currentUser, setCurrentUser] = useState(null);
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // API base URL
    const API_URL = "http://localhost:8082/api/auth";

    const handleSignUp = async (formData) => {
        setIsLoading(true);
        setAuthError('');
        setAuthSuccess('');
        try {
            await axios.post(`${API_URL}/signup`, formData);
            setAuthSuccess('Registration successful! Please login.');
            // Switch to login view after a short delay
            setTimeout(() => {
                setModalView('login');
                setAuthSuccess('');
            }, 2000);
        } catch (error) {
            setAuthError(error.response?.data || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogin = async (formData) => {
        setIsLoading(true);
        setAuthError('');
        try {
            await axios.post(`${API_URL}/login`, formData);
            // In a real app, the response would contain user data and a token
            setCurrentUser({ email: formData.email });
            setModalView(null); // Close modal on success
        } catch (error) {
            setAuthError(error.response?.data || 'Invalid credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const navigateTo = (pageName) => {
        setPage(pageName);
        window.scrollTo(0, 0); 
        if (['flights', 'hotels', 'cabs'].includes(pageName)) {
            setActiveTab(pageName);
            if (pageName === 'flights') setSearchResults(mockFlights);
            if (pageName === 'hotels') setSearchResults(mockHotels);
            if (pageName === 'cabs') setSearchResults(mockCabs);
        } else {
             setSearchResults([]);
        }
        if (isMobileMenuOpen) setMobileMenuOpen(false);
    };
    
    const openModal = (view) => {
        setModalView(view);
        setAuthError('');
        setAuthSuccess('');
    };

    const renderPage = () => {
        switch(page) {
            case 'flights':
            case 'hotels':
            case 'cabs':
                return <SearchResultsPage page={page} results={searchResults} onBack={() => navigateTo('home')} />;
            case 'home':
            default:
                return <HomePage onSearch={navigateTo} activeTab={activeTab} setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="app-wrapper">
            <StyleProvider />
            {/* Header */}
            <header className="header">
                <nav className="nav-container">
                    <button onClick={() => navigateTo('home')} className="logo">TripPlan</button>
                    <div className="desktop-nav">
                        <NavLink onClick={() => navigateTo('flights')} isActive={page==='flights'}>Flights</NavLink>
                        <NavLink onClick={() => navigateTo('hotels')} isActive={page==='hotels'}>Hotels</NavLink>
                        <NavLink onClick={() => navigateTo('cabs')} isActive={page==='cabs'}>Cabs</NavLink>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        {currentUser ? (
                            <div className="user-info">
                                <span>Welcome!</span>
                                <button onClick={handleLogout} className="logout-btn">Logout</button>
                            </div>
                        ) : (
                            <div className="header-buttons-desktop">
                               <button onClick={() => openModal('login')} className="login-btn">Login</button>
                               <button onClick={() => openModal('signup')} className="signup-btn">Sign Up</button>
                            </div>
                        )}
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="mobile-menu-btn">
                            <i className="fas fa-bars" style={{fontSize: '1.25rem'}}></i>
                        </button>
                    </div>
                </nav>
                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        <MobileNavLink onClick={() => navigateTo('flights')}>Flights</MobileNavLink>
                        <MobileNavLink onClick={() => navigateTo('hotels')}>Hotels</MobileNavLink>
                        <MobileNavLink onClick={() => navigateTo('cabs')}>Cabs</MobileNavLink>
                        <div style={{borderTop: '1px solid #e5e7eb', margin: '0.5rem 0'}}></div>
                        {currentUser ? (
                            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 600, border: 'none'}}>Logout</button>
                        ) : (
                            <>
                                <button onClick={() => { openModal('login'); setMobileMenuOpen(false); }} style={{width: '100%', textAlign: 'left', backgroundColor: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 600, border: 'none'}}>Login</button>
                                <button onClick={() => { openModal('signup'); setMobileMenuOpen(false); }} style={{width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 600, marginTop: '0.5rem', border: 'none'}}>Sign Up</button>
                            </>
                        )}
                    </div>
                )}
            </header>

            <main>
                {renderPage()}
            </main>

            {/* Footer */}
            <footer id="contact" style={{backgroundColor: '#1f2937', color: 'white', textAlign: 'center', padding: '2.5rem 1.5rem'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>TripPlan</h3>
                <p style={{color: '#9ca3af', marginBottom: '1.5rem'}}>Your adventure, simplified.</p>
                <div style={{display: 'flex', justifyContent: 'center', gap: '1.5rem'}}>
                    <a href="#" style={{color: '#9ca3af', fontSize: '1.25rem'}}><i className="fab fa-facebook-f"></i></a>
                    <a href="#" style={{color: '#9ca3af', fontSize: '1.25rem'}}><i className="fab fa-twitter"></i></a>
                    <a href="#" style={{color: '#9ca3af', fontSize: '1.25rem'}}><i className="fab fa-instagram"></i></a>
                    <a href="#" style={{color: '#9ca3af', fontSize: '1.25rem'}}><i className="fab fa-linkedin-in"></i></a>
                </div>
                 <p style={{color: '#6b7280', fontSize: '0.875rem', marginTop: '2rem'}}>&copy; 2024 TripPlan. All rights reserved.</p>
            </footer>
            
            {/* Modals */}
            {modalView === 'login' && <AuthModal onClose={() => setModalView(null)}><LoginContent onLogin={handleLogin} onClose={() => setModalView(null)} onSwitchToSignUp={() => openModal('signup')} authError={authError} isLoading={isLoading} /></AuthModal>}
            {modalView === 'signup' && <AuthModal onClose={() => setModalView(null)}><SignUpContent onSignUp={handleSignUp} onClose={() => setModalView(null)} onSwitchToLogin={() => openModal('login')} authError={authError} authSuccess={authSuccess} isLoading={isLoading} /></AuthModal>}
        </div>
    );
}


