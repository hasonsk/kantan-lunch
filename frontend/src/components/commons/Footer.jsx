import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; 2024 Your Website. All Rights Reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    textAlign: 'center',
    margin : '100px 0 0 0 '
  },
};

export default Footer;
