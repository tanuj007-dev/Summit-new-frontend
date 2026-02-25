import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ThankYouPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderedId = queryParams.get('order');

  return (
    <div className="thankyou-wrapper" style={styles.wrapper}>
      <div style={styles.container}>
        <img
          alt="Order Success"
          src="/asset/images/checkmark.gif"
          style={{
            width: '50px',
            marginBottom: '20px',
            left: '44%',
            position: 'relative',
          }}
        />
        <h1 style={styles.heading}>Thank You for Your Order!</h1>
        <p style={styles.text}>
          Your order has been successfully placed.
        </p>
        {orderedId && (
          <p style={{ ...styles.text, fontWeight: 'bold', fontSize: '18px' }}>
            ✅ Your Order ID: <span style={{ color: '#e53935' }}>{orderedId}</span>
          </p>
        )}
        <p style={styles.text}>
          You will receive a confirmation email with tracking details soon.
        </p>
        <Link to="/" style={styles.button}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    textAlign: 'center',
    padding: '60px 20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '28px',
    color: '#333',
  },
  text: {
    fontSize: '16px',
    color: '#666',
    margin: '20px 0',
  },
  button: {
    display: 'inline-block',
    padding: '10px 25px',
    backgroundColor: '#e53935',
    color: '#fff',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default ThankYouPage;
