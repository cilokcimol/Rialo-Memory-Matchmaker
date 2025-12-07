import React from "react";

const Card = ({ title, description, imageUrl, actionText, onActionClick }) => {
    return (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-sm w-full">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm mb-4">{description}</p>
                {actionText && (
                    <button
                        onClick={onActionClick}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        {actionText}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Card;
