import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button.jsx'

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary-600">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Sorry, the page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link to="/">
                        <Button size="lg" className="w-full">
                            <Home className="w-5 h-5 mr-2" />
                            Go to Homepage
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotFound