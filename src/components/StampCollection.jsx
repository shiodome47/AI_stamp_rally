import React from 'react';

const StampCollection = ({ stamps }) => {
    return (
        <div className="stamp-collection">
            <h2>Your Stamps</h2>
            <div className="stamp-grid">
                {stamps.map((stamp) => (
                    <div key={stamp.id} className={`stamp-card ${stamp.unlocked ? 'unlocked' : 'locked'}`}>
                        <div className="stamp-icon">
                            {stamp.unlocked ? '💮' : '🔒'}
                        </div>
                        <div className="stamp-name">{stamp.name}</div>
                        {stamp.unlocked && <div className="stamp-date">Acquired!</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StampCollection;
