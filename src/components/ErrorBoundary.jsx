import React from "react";

/**
 * Catches JavaScript errors in the child tree and shows a fallback UI
 * instead of a blank screen. Prevents the "render then blank" issue
 * when a lazy-loaded or child component throws after initial load.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      const err = this.state.error;
      const message = err?.message || (err && String(err)) || "";
      const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV;
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            The page encountered an error. Try refreshing.
          </p>
          {isDev && message && (
            <pre className="mb-4 p-3 text-left text-xs bg-red-50 text-[#941007] rounded max-w-lg overflow-auto">
              {message}
            </pre>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#941007] text-white rounded-full font-medium hover:bg-[#941007] transition"
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
