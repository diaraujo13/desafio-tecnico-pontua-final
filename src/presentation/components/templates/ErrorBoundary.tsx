import React, { Component, ErrorInfo, ReactNode } from 'react';
import { GlobalErrorFallback, GlobalErrorFallbackProps } from './GlobalErrorFallback';

export interface ErrorBoundaryProps {
  /**
   * Children components to wrap with error boundary
   */
  children: ReactNode;
  /**
   * Custom fallback component (optional, defaults to GlobalErrorFallback)
   */
  fallback?: React.ComponentType<GlobalErrorFallbackProps>;
  /**
   * Callback invoked when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Callback invoked when error boundary resets
   */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 *
 * A React Error Boundary that catches JavaScript errors anywhere in the child
 * component tree, logs those errors, and displays a fallback UI instead of
 * crashing the entire application.
 *
 * This component uses React's class component lifecycle methods (componentDidCatch)
 * as Error Boundaries can only be implemented as class components.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error callback for external logging/reporting
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    // Reset error boundary state
    this.setState({
      hasError: false,
      error: null,
    });

    // Call optional reset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || GlobalErrorFallback;

      return <FallbackComponent error={this.state.error} resetError={this.handleReset} />;
    }

    return this.props.children;
  }
}
