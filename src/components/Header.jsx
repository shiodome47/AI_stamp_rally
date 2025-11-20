import React from 'react';

const Header = ({ collectedCount, totalCount }) => {
    const progressPercentage = Math.round((collectedCount / totalCount) * 100);

    return (
        <header className="app-header">
            <h1>AI Stamp Rally</h1>
            <div className="progress-container">
                <div className="progress-text">
                    Stamps: {collectedCount} / {totalCount}
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        </header>
    );
};

export default Header;
