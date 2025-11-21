import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-background text-dark-foreground p-4 text-center">
      <h1 className="text-6xl font-extrabold text-dark-primary mb-4">404</h1>
      <p className="text-2xl text-dark-foreground mb-8">Page Not Found</p>
      <p className="text-lg text-muted-foreground mb-12">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <button className="bg-dark-primary hover:bg-dark-primary/90 text-dark-primary-foreground font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default NotFound;