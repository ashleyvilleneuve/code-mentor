import React from "react";

export default function Radio({name, value, handler, checked, subtitle}) {
    const id = `${name}-${value.replace(/\s/g, '-')}`;
    return (
        <>
            <li>
                <input type="radio" id={id} name={name} value={value} className="hidden peer" required checked={checked} onChange={handler} /> 
                <label htmlFor={id} className="inline-flex items-center h-full w-full p-5 text-gray-500 bg-white border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                    <div className="block mx-auto">
                        <div className="w-full text-base font-semibold">{value}</div>
                        {subtitle !== "" ? (
                            <div className="w-full text-xs">{subtitle}</div>
                        ) : ("")}
                    </div>
                </label>
            </li>
        </>
    );
}