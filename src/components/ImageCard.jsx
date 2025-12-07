import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";

const ImageCard = ({ data, setSelectedCards, selectedCards, gameStarted, resetCard }) => {
    const [charData] = useState(data);

    const [isFlipped, setIsFlipped] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [disableClick, setDisableClick] = useState(false);
    const [match, setMatch] = useState(false);

    useEffect(() => {
        if (resetCard){
            setMatch(false);
        }
    }, [resetCard]);

    const handleClick = () => {
        if (!gameStarted){
            console.warn("Game Not Started");
            return;
        }

        if (disableClick && gameStarted && resetCard){
            console.warn("Click Disabled");
            return;
        }

        if (selectedCards.length === 2) {
            console.warn("Already Selected 2 Pairs");
            return;
        }

        if (isFlipping || isFlipped) return;
        setIsFlipping(true);
        setSelectedCards(prev => [...prev, charData.couple_id]);

        setTimeout(() => {
            setIsFlipped(true);
        }, 200);

        setTimeout(() => {
            setIsFlipping(false);
        }, 300);
    };

    useEffect(() => {
        if (resetCard){
            if (isFlipped || isFlipping){
                setIsFlipping(true);
                setTimeout(() => {
                    setIsFlipped(false);
                }, 200);

                setTimeout(() => {
                    setIsFlipping(false);
                }, 300);
            }
        }else{
            setTimeout(() => {
                if (selectedCards.length === 2){
                    if (!selectedCards.includes(charData.couple_id)){
                        return;
                    }

                    if (selectedCards[0] === selectedCards[1] && (selectedCards.includes(charData.couple_id))) {
                        setDisableClick(true); 
                        setMatch(true);
                    }else{
                        if (isFlipped || isFlipping){
                            setIsFlipping(true);
                            setTimeout(() => {
                                setIsFlipped(false);
                            }, 200);

                            setTimeout(() => {
                                setIsFlipping(false);
                            }, 300);
                        }
                    }

                    setSelectedCards([]);
                }
            }, 310);
        }
    }, [selectedCards.length, resetCard]);


    return (
        <div
            className="relative w-full aspect-[2/3] perspective cursor-pointer"
            onClick={handleClick}
        >
        <div className={`relative w-full h-full ${isFlipping ? "flip-sequence" : ""}`}>
                {!isFlipped && (
                    <div className="absolute w-full h-full backface-hidden overflow-hidden rounded-xl shadow-xl border-2 border-[#333] bg-[#1A1A1A]">
                        <img
                            src={'http://' + location.host + '/assets/' + 'rialo-logo-white.png'}
                            alt='card back'
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>
                )}

                {isFlipped && (
                    <div
                        className={`absolute w-full h-full backface-hidden overflow-hidden rounded-xl shadow-xl border-2 ${
                            match ? "animate-border-ring border-emerald-400" : "border-0"
                        } bg-[#F2F0E6]`}
                    >
                        <img
                            src={charData.image}
                            alt='character'
                            className="w-full h-full object-contain p-2"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

ImageCard.propTypes = {
    data: PropTypes.object.isRequired,
    setSelectedCards: PropTypes.func.isRequired,
    selectedCards: PropTypes.array,
    gameStarted: PropTypes.bool,
    resetCard: PropTypes.bool
};

export default ImageCard;