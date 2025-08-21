import React from "react";
type InputProps = React.InputHTMLAttributes<HTMLInputElement>
const Input:React.FC<InputProps> = ({type= "text", name, placeholder, ...rest}) => {
    return (
        <input
            type={type}
            id={name}
            name={name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
             {...rest}
        />
    )
}
export default Input;