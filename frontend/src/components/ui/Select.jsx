import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({
                               label,
                               error,
                               helperText,
                               options = [],
                               placeholder = 'Select an option',
                               className = '',
                               ...props
                           }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    className={`input-field appearance-none pr-10 ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    )
})

Select.displayName = 'Select'

export default Select