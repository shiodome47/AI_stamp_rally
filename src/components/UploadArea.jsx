import React, { useRef } from 'react';

const UploadArea = ({ onFileSelect, isAnalyzing }) => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className="upload-area">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
            <div className="upload-content">
                <p>Take a photo or upload an image to get a stamp!</p>
                <button
                    className="upload-btn"
                    onClick={handleButtonClick}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? 'Analyzing...' : 'Upload Photo'}
                </button>
                <p className="hint-text">Try uploading a "Cat" or "Mt. Fuji" image.</p>
            </div>
        </div>
    );
};

export default UploadArea;
