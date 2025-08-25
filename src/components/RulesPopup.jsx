import React, { useEffect } from 'react';

const RulesPopup = ({ onClose }) => {
    // Automatically close the popup after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 8000);

        // Cleanup the timer if the component unmounts or onClose changes
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="popup-close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="popup-title">How To Play</h2>
                <p className="popup-rule">Guess the 6-letter word in 6 tries.</p>
                <hr className="popup-divider" />
                <ul className="popup-list">
                    <li>Each guess must be a valid 6-letter word.</li>
                    <li>The color of the tiles will change to show how close your guess was to the word.</li>
                </ul>
                <div className="popup-examples">
                    <p><strong>Examples</strong></p>
                    <div className="example">
                        <div className="tile correct">W</div>
                        <div className="tile">E</div>
                        <div className="tile">A</div>
                        <div className="tile">R</div>
                        <div className="tile">Y</div>
                        <div className="tile">S</div>
                    </div>
                    <p className="example-text"><strong>W</strong> is in the word and in the correct spot.</p>

                    <div className="example">
                        <div className="tile">P</div>
                        <div className="tile present">I</div>
                        <div className="tile">L</div>
                        <div className="tile">L</div>
                        <div className="tile">O</div>
                        <div className="tile">W</div>
                    </div>
                    <p className="example-text"><strong>I</strong> is in the word but in the wrong spot.</p>

                    <div className="example">
                        <div className="tile">V</div>
                        <div className="tile">A</div>
                        <div className="tile">G</div>
                        <div className="tile">U</div>
                        <div className="tile absent">E</div>
                        <div className="tile">S</div>
                    </div>
                    <p className="example-text"><strong>E</strong> is not in the word in any spot.</p>
                </div>
            </div>
        </div>
    );
};

export default RulesPopup;
