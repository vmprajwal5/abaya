import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">
                            Something went wrong
                        </h1>
                        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                            <p className="text-red-800 font-semibold mb-2">Error:</p>
                            <pre className="text-sm text-red-700 whitespace-pre-wrap">
                                {this.state.error && this.state.error.toString()}
                            </pre>
                        </div>
                        {this.state.errorInfo && (
                            <details className="mb-4">
                                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                                    Show stack trace
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
