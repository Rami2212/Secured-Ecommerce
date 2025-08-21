const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="border-gray-800 -mt-4 pt-8 text-center text-sm text-gray-400">
                <p>&copy; {currentYear} BuyWorld. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer