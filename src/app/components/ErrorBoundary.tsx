import React from 'react';
import { useRouteError, useNavigate } from 'react-router';
import { Button } from './Button';

export function ErrorBoundary() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="text-gray-600">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <Button
          variant="emergency"
          size="large"
          fullWidth
          onClick={() => navigate('/')}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
