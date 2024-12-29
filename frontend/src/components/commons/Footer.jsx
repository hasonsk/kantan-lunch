import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; 2024 Kantan Lunch. All Rights Reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    textAlign: 'center',
    margin : '120px 0 0 0 '
  },
};

export default Footer;
