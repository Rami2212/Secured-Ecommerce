const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`card p-6 ${className}`} {...props}>
            {children}
        </div>
    )
}

const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    )
}

const CardTitle = ({ children, className = '' }) => {
    return (
        <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
            {children}
        </h3>
    )
}

const CardDescription = ({ children, className = '' }) => {
    return (
        <p className={`text-sm text-gray-600 mt-1 ${className}`}>
            {children}
        </p>
    )
}

const CardContent = ({ children, className = '' }) => {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>
            {children}
        </div>
    )
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card