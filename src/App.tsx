import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LiveTracking from './pages/LiveTrackingNew';
import RouteSearch from './pages/RouteSearch';
import RoutePlanning from './pages/RoutePlanning';
import RouteDetails from './pages/RouteDetails';
import RouteView from './pages/RouteView';
import Profile from './pages/Profile';
import Saved from './pages/Saved';
import MyTickets from './pages/MyTickets';
import DigitalTicket from './pages/DigitalTicket';
import FareCalculator from './pages/FareCalculator';
import LiveTrackingEnhanced from './pages/LiveTrackingEnhanced';
import LiveTrackingSimple from './pages/LiveTrackingSimple';
import FeedbackRating from './pages/FeedbackRating';
import NotificationToast from './components/NotificationToast';
import NotificationSystem from './components/NotificationSystem';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';

const AppContent: React.FC = () => {
  return (
    <div className="app">
      <NotificationToast />
      <NotificationSystem />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live" element={<LiveTrackingEnhanced />} />
        <Route path="/search" element={<RoutePlanning />} />
        <Route path="/route/:busNumber" element={<RouteDetails />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/tickets" element={<MyTickets />} />
        <Route path="/tickets" element={<DigitalTicket />} />
        <Route path="/fare" element={<FareCalculator />} />
        <Route path="/feedback" element={<FeedbackRating />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
};

export default App;