import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock, Smartphone } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute',
          top: '5rem',
          left: '2.5rem',
          width: '18rem',
          height: '18rem',
          background: '#a855f7',
          borderRadius: '50%',
          filter: 'blur(4rem)',
          opacity: 0.2,
          animation: 'pulse 2s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '10rem',
          right: '2.5rem',
          width: '18rem',
          height: '18rem',
          background: '#3b82f6',
          borderRadius: '50%',
          filter: 'blur(4rem)',
          opacity: 0.2,
          animation: 'pulse 2s infinite',
          animationDelay: '1s'
        }}></div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '0 1.5rem',
        textAlign: 'center'
      }}>
        {/* Logo and Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontSize: '6rem',
            marginBottom: '1.5rem',
            animation: 'bounce 1s infinite'
          }}>🚍</div>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 900,
            color: 'white',
            marginBottom: '1rem',
            letterSpacing: '-0.025em'
          }}>
            Smart <span style={{
              background: 'linear-gradient(to right, #22d3ee, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Yatra</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#bfdbfe',
            marginBottom: '0.5rem',
            fontWeight: 500
          }}>Your Intelligent Journey Companion</p>
          <p style={{
            fontSize: '1.125rem',
            color: '#93c5fd',
            maxWidth: '42rem',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Experience the future of public transport with real-time tracking, smart notifications, and seamless journey planning
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          maxWidth: '56rem',
          width: '100%'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <MapPin style={{ width: '3rem', height: '3rem', color: '#22d3ee', margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>Live Tracking</h3>
            <p style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>Real-time bus locations and accurate ETAs</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Clock style={{ width: '3rem', height: '3rem', color: '#a855f7', margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>Smart Alerts</h3>
            <p style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>Never miss your bus with intelligent notifications</p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(16px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Smartphone style={{ width: '3rem', height: '3rem', color: '#ec4899', margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>Easy to Use</h3>
            <p style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>Intuitive design for seamless navigation</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link to="/home">
          <button style={{
            position: 'relative',
            padding: '1rem 3rem',
            background: 'linear-gradient(to right, #06b6d4, #9333ea)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            Get Started
            <ArrowRight style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </Link>

        {/* Stats */}
        <div style={{
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#22d3ee' }}>500+</div>
            <div style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>Active Buses</div>
          </div>
          <div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#a855f7' }}>50+</div>
            <div style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>Routes</div>
          </div>
          <div>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ec4899' }}>24/7</div>
            <div style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>Live Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;