import React from "react";
type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>
const Textarea:React.FC<InputProps> = ({name, placeholder, ...rest}) => {
    return (
        <textarea
            id={name}
            name={name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        {...rest}
        >
        </textarea>
    )
}
export default Textarea;