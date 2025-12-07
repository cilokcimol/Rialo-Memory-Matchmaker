import {useState, useEffect, useRef} from "react";
import ImageCard from "./components/ImageCard.jsx";

function App() {
    const COUPLE_LIMIT = 8;
    const MAX_TIMES = 120;
    const locationAssets = './assets/';
    const [shuffled, setShuffled] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [couplePoints, setCouplePoints] = useState(0);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(MAX_TIMES);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [resetCard, setResetCard] = useState(false);


    useEffect(() => {
        if (gameStarted){
            timerRef.current = setInterval(() => {
                if (timer <= 0) {
                    setGameStarted(false);
                }
                setTimer(prev => prev - 1);
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [gameStarted]);

    useEffect(() => {
        if (timer <= 0 && gameStarted) {
            clearInterval(timerRef.current);
            timerRef.current = null;

            const timeScore = (timer / MAX_TIMES) * 100;
            const coupleScore = (couplePoints / COUPLE_LIMIT) * 100;
            const maxPenalty = 50;
            const penaltyScore = Math.min(moves * 1, maxPenalty);

            const rawScore = (timeScore * 0.4) + (coupleScore * 0.5) - penaltyScore;
            const finalScore = Math.max(0, Math.round(rawScore));

            setFinalScore(finalScore);
            setGameStarted(false);
            setShowPopup(true);
            setGameEnded(true);
        }
    }, [timer]);

    useEffect(() => {
        if (couplePoints === COUPLE_LIMIT && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;

            const timeScore = (timer / MAX_TIMES) * 100;
            const coupleScore = (couplePoints / COUPLE_LIMIT) * 100;
            const maxPenalty = 50;
            const penaltyScore = Math.min(moves * 1, maxPenalty);

            const rawScore = (timeScore * 0.4) + (coupleScore * 0.5) - penaltyScore;
            const finalScore = Math.max(0, Math.round(rawScore));

            setFinalScore(finalScore);
            setGameStarted(false);
            setShowPopup(true);
            setGameEnded(true);
        }
    }, [couplePoints]);

    const songs = [
        'wave to earth - love.mp3',
        'The Walters - I Love You So.mp3',
        'beabadoobee - Glue Song.mp3',
        'Laufey - Valentine.mp3',
    ]

    const [selectedSong, setSelectedSong] = useState(() => {
        const index = Math.floor(Math.random() * songs.length);
        return songs[index];
    });

    const brandImages = [
        'rialo-logo-white.png',
        'long-black.png',
        'rialo-background.png',
        'long-blue.png',
        'rialo-logo-blue.png',
        'table-texture.png',
        'rialo-logo-black.png',
        'rialo-partner.png'
    ];

    const characters = [];
    brandImages.forEach((imgName, index) => {
       characters.push({
           name: `Rialo-Item-${index}-A`,
           image: locationAssets + imgName,
           couple_id: index
       });
       characters.push({
           name: `Rialo-Item-${index}-B`,
           image: locationAssets + imgName,
           couple_id: index
       });
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            let deck = [...characters];

            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }

            const selectedCharacters = deck;

            setShuffled(selectedCharacters);

            selectedCharacters.forEach(char => {
                const img = new Image();
                img.src = char.image;
            });

        }, 310);

        return () => clearTimeout(timeout);
    }, [resetCard]);

    useEffect(() => {
        const img = new Image();
        img.src = locationAssets + 'rialo-logo-black.png';
    }, []);


    useEffect(() => {
        if (selectedCards.length !== 2) return;

        if (selectedCards[0] === selectedCards[1]) {
            setCouplePoints(prev => prev + 1);
        } else {
            setMoves(prev => prev + 1);
        }
    }, [selectedCards]);

    useEffect(() => {
        if (resetCard){
            setResetCard(false)
        }
    }, [resetCard]);

    const handleStart =() => {
        if (gameEnded){
            setResetCard(true);
        }

        if (gameStarted && !gameEnded) {
            return;
        }

        setSelectedSong(() => {
            const index = Math.floor(Math.random() * songs.length);
            return songs[index];
        });

        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 1; 
                audioRef.current.play().catch(e => {
                    console.warn("Autoplay blocked by browser:", e);
                });
            }
        }, 100);

        setSelectedCards([]);
        setCouplePoints(0);
        setTimer(MAX_TIMES);
        setFinalScore(0);
        setGameStarted(true);
        setGameEnded(false);
    }

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row p-4 gap-4 bg-[#111111]">
            <div className="w-full md:w-1/4 bg-[#1A1A1A] rounded-2xl shadow-lg p-6 flex flex-col gap-6 border border-[#333333]">
                <h1 className="text-3xl font-extrabold text-center text-[#F2F0E6]">Rialo Matchmaker 💖</h1>
                <button
                    onClick={handleStart}
                    disabled={gameStarted}
                    className={`px-4 py-2 text-[#111111] font-bold rounded-lg transition ${
                        gameStarted
                            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                            : 'bg-[#F2F0E6] hover:bg-[#D4CFC0]'
                    }`}
                >
                    {gameStarted ? 'Game Started' : gameEnded ? 'Play Again' : 'Start Game'}
                </button>

                <div className="text-lg font-medium text-[#F2F0E6] space-y-2">
                    <p>Wrong Moves: <span className="font-bold text-white">{moves}</span></p>
                    <p>⏱️ Timer: <span className="font-bold text-white">{timer}</span> seconds</p>
                    <p>⭐ Score (Couples): <span className="font-bold text-white">{couplePoints}</span></p>
                    <p>🏁 Final Score: <span className="font-bold text-white">{finalScore}</span></p>
                </div>

                <div className="mt-auto">
                    <p className="text-[#F2F0E6] font-semibold mb-1">🎵 Theme Song</p>
                    <audio
                        key={selectedSong} 
                        ref={audioRef}
                        controls
                        className="w-full invert hue-rotate-180" 
                    >
                        <source src={`/audio/${selectedSong}`} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-4 w-full p-2 place-content-center">
                {shuffled.map((char) => (
                    <ImageCard
                        key={char.name}
                        data={char}
                        setSelectedCards={setSelectedCards}
                        selectedCards={selectedCards}
                        gameStarted={gameStarted}
                        resetCard={resetCard}
                    />
                ))}
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="relative bg-[#1A1A1A] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn border border-[#333333]">
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2 className="text-3xl font-bold text-[#F2F0E6] mb-4">🎉 Game Over!</h2>
                        <p className="text-lg text-[#D4CFC0]">Wrong Moves: <span className="font-bold text-white">{moves}</span></p>
                        <p className="text-lg text-[#D4CFC0]">Couples Found: <span className="font-bold text-white">{couplePoints}/{COUPLE_LIMIT}</span></p>
                        <p className="text-lg text-[#D4CFC0] mb-4">Time Left: <span className="font-bold text-white">{Math.max(timer, 0)} seconds / 2 Minutes</span></p>
                        <p className="text-2xl font-semibold text-[#F2F0E6] mb-6">Final Score: <span className="font-extrabold text-emerald-400">{finalScore}</span></p>
                        <button
                            onClick={() => {
                                setShowPopup(false);
                                handleStart();
                            }}
                            className="mt-2 px-6 py-2 rounded-lg bg-[#F2F0E6] hover:bg-[#D4CFC0] text-[#111111] font-bold transition"
                        >
                            Play Again 💞
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
