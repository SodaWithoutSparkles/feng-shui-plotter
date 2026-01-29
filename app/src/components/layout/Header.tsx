import React from 'react';

export const Header: React.FC = () => {
    return (
        <div className="h-8 bg-gray-900 border-b border-gray-700 flex items-center px-2 text-sm text-gray-300 select-none">
            <div className="px-3 hover:bg-gray-700 cursor-pointer h-full flex items-center">File</div>
            <div className="px-3 hover:bg-gray-700 cursor-pointer h-full flex items-center">Edit</div>
            <div className="px-3 hover:bg-gray-700 cursor-pointer h-full flex items-center">Option</div>
        </div>
    );
};
