import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import styles from '@/styles/Home.module.css';
import tmi from 'tmi.js';

export default function LichessVoting() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [votes, setVotes] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [selectedMove, setSelectedMove] = useState(null);
  const [voterCount, setVoterCount] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [isController, setIsController] = useState(false);
  const [twitchChannel, setTwitchChannel] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [topMoves, setTopMoves] = useState([]);
  const [connectedToChat, setConnectedToChat] = useState({
    twitch: false,
    youtube: false
  });

  let GOOGLE_API_KEY = "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY";

  useEffect(() => {
    if (joined) {
      const twitchCleanup = startTwitchChatListener();
      const youtubeCleanup = startYoutubeChatListener();
      
      return () => {
        twitchCleanup();
        youtubeCleanup();
      };
    }
  }, [joined]);

  const getYoutubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getTwitchChannel = (url) => {
    const regex = /(?:www\.)?twitch\.tv\/([a-zA-Z0-9_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const startTwitchChatListener = () => {
    if (!twitchChannel) return () => {};
    
    const client = new tmi.Client({
      channels: [twitchChannel]
    });

    client.connect();
    setConnectedToChat(prev => ({ ...prev, twitch: true }));

    client.on('message', (channel, tags, message, self) => {
      const move = validateChessMove(message.trim().toLowerCase());
      if (move) {
        handleChatMessage('twitch', move);
      }
    });

    return () => {
      client.disconnect();
      setConnectedToChat(prev => ({ ...prev, twitch: false }));
    };
  };

  const startYoutubeChatListener = () => {
    if (!youtubeVideoId) return () => {};

    const interval = setInterval(() => {
      fetchYouTubeChatMessages(youtubeVideoId).then(messages => {
        messages.forEach(msg => {
          const move = validateChessMove(msg.text.trim().toLowerCase());
          if (move) {
            handleChatMessage('youtube', move);
          }
        });
      });
    }, 2000);

    setConnectedToChat(prev => ({ ...prev, youtube: true }));
    return () => {
      clearInterval(interval);
      setConnectedToChat(prev => ({ ...prev, youtube: false }));
    };
  };

  const validateChessMove = (input) => {
    const moves = game.moves({ verbose: true });
    const standardized = input.replace(/[^a-h1-8nbrqk]/gi, '');
    return moves.find(move => 
      move.san.toLowerCase() === standardized ||
      `${move.from}${move.to}` === standardized
    );
  };

  const handleChatMessage = (source, message) => {
    if (message.startsWith("vote: ")) {
      const moveNotation = message.replace("vote: ", "").trim();
      setVotes(prev => ({
        ...prev,
        [`${source}:${moveNotation}`]: (prev[`${source}:${moveNotation}`] || 0) + 1
      }));
      setVoterCount(prev => prev + 1);
    }
  };

  
 

  const joinRoom = () => {
    if (!username.trim()) return;
    if (!twitchChannel && !youtubeVideoId) {
      alert('Please enter at least one channel');
      return;
    }
    
    setIsController(username === 'imericrosenmain');
    setJoined(true);
  };

  const startGame = () => {
    if (isController) {
      setGameStarted(true);
      setRoomColors({ twitch: 'white', youtube: 'black' });
      setCurrentTurn('white');
      setTimeRemaining(60);
    }
  };

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true
    });

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(255,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
      return move;
    });

    return newSquares;
  }

  function onSquareClick(square) {
    if (!joined || !gameStarted) return;

    const desiredRoom = currentTurn === 'white'
      ? (roomColors.twitch === "white" ? "twitch" : "youtube")
      : (roomColors.twitch === "black" ? "twitch" : "youtube");
    if (roomId !== desiredRoom) return;

    const piece = game.get(square);

    if (moveFrom) {
      const legalMove = game.moves({ verbose: true }).find(
        move => move.from === moveFrom && move.to === square
      );

      if (legalMove) {
        const moveNotation = `${moveFrom}-${square}`;
        setSelectedMove(moveNotation);
      }

      setMoveFrom('');
      setOptionSquares({});
      return;
    }

    if (piece && piece.color === game.turn()) {
      setMoveFrom(square);
      setOptionSquares(getMoveOptions(square));
    }
  }

  function handleMove(moveString) {
    const [from, to] = moveString.split('-');

    try {
      const newGame = new Chess(game.fen());
      const move = newGame.move({
        from,
        to,
        promotion: 'q'
      });

      if (move) {
        setGame(newGame);
        setMoveFrom('');
        setOptionSquares({});
        setTimeout(() => {
          setTimeRemaining(60);
        }, 1000);
      }
    } catch (e) {
      console.error('Invalid move:', e);
    }
  }

  const calculateVoteStats = () => {
    if (!votes || Object.keys(votes).length === 0)
      return { percentages: {}, totalVotes: 0, leadingMove: null };

    const totalVotes = Object.values(votes).reduce((acc, count) => acc + count, 0);
    const percentages = {};
    let leadingMove = { move: null, count: 0 };

    Object.entries(votes).forEach(([move, count]) => {
      percentages[move] = Math.round((count / totalVotes) * 100);

      if (count > leadingMove.count) {
        leadingMove = { move, count, percentage: percentages[move] };
      }
    });

    return { percentages, totalVotes, leadingMove };
  };

  const { percentages: votePercentages, totalVotes, leadingMove } = calculateVoteStats();

  const formatMove = (moveString) => {
    if (!moveString) return '';
    const [from, to] = moveString.split('-');
    return `${from} → ${to}`;
  };

  const getPieceName = (square) => {
    if (!square || !game) return '';

    const piece = game.get(square);
    if (!piece) return '';

    const pieceNames = {
      p: 'Pawn',
      n: 'Knight',
      b: 'Bishop',
      r: 'Rook',
      q: 'Queen',
      k: 'King'
    };

    return pieceNames[piece.type] || '';
  };

  const updateTopMoves = () => {
    const sortedMoves = Object.entries(votes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([move, count]) => ({
        move,
        count,
        percentage: Math.round((count / totalVotes) * 100)
      }));
    
    setTopMoves(sortedMoves);
  };

  useEffect(() => {
    updateTopMoves();
  }, [votes]);

  return (
    <>
      <Head>
        <title>Chess Voting | Twitch vs YouTube</title>
        <meta name="description" content="Vote on the next chess move" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ width: '100%', maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <h1 className={styles.title}>Two-Room Chess Democracy</h1>
        <p style={{ color: '#777', marginBottom: '20px' }}>
          Twitch vs YouTube! Colors are assigned randomly at game start.
        </p>

        {!joined ? (
          <div style={{ marginBottom: '20px' }}>
            <h2>Enter Channels to Start</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                value={twitchChannel}
                onChange={(e) => {
                  const channel = getTwitchChannel(e.target.value);
                  setTwitchChannel(channel || e.target.value);
                }}
                placeholder="Enter Twitch channel URL or name"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '10px',
                  borderLeft: '4px solid #6441a5' 
                }}
              />
              <input
                type="text"
                value={youtubeVideoId}
                onChange={(e) => {
                  const videoId = getYoutubeVideoId(e.target.value);
                  setYoutubeVideoId(videoId || e.target.value);
                }}
                placeholder="Enter YouTube live stream URL"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '10px',
                  borderLeft: '4px solid #ff0000' 
                }}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
            </div>

            <button
              onClick={joinRoom}
              className={styles.button}
              disabled={!twitchChannel && !youtubeVideoId}
            >
              Start Watching Chats
            </button>
          </div>
        ) : (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              gap: '10px'
            }}>
              <div>
                {twitchChannel && (
                  <span style={{ color: '#6441a5' }}>
                    Twitch: {connectedToChat.twitch ? '✓' : '⟳'}
                  </span>
                )}
                {twitchChannel && youtubeVideoId && ' | '}
                {youtubeVideoId && (
                  <span style={{ color: '#ff0000' }}>
                    YouTube: {connectedToChat.youtube ? '✓' : '⟳'}
                  </span>
                )}
              </div>
              <span>Votes: <strong>{voterCount}</strong></span>
              <span>Time: <strong>{timeRemaining}s</strong></span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              {isController && !gameStarted && (
                <button
                  onClick={startGame}
                  className={styles.button}
                  style={{ background: '#4caf50' }}
                >
                  Start Game
                </button>
              )}

              {!gameStarted ? (
                <div>Waiting for game to start...</div>
              ) : (
                <div style={{
                  padding: '10px',
                  background: currentTurn === 'white' ? (roomColors.twitch === "white" ? '#6441a5' : '#ff0000') 
                                                    : (roomColors.twitch === "black" ? '#6441a5' : '#ff0000'),
                  borderRadius: '5px',
                  marginBottom: '15px'
                }}>
                  Current Turn ({currentTurn}): {currentTurn === 'white' 
                    ? (roomColors.twitch === "white" ? 'Twitch' : 'YouTube')
                    : (roomColors.twitch === "black" ? 'Twitch' : 'YouTube')}
                  ({timeRemaining}s)
                </div>
              )}
            </div>

            {leadingMove && (
              <div style={{
                background: leadingMove.percentage > 50 ? '#4caf50' : '#2196f3',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                fontWeight: 'bold'
              }}>
                <span>Leading move: {formatMove(leadingMove.move)} </span>
                <span>({leadingMove.count}/{totalVotes} votes, {leadingMove.percentage}%)</span>
                {leadingMove.percentage > 50 && <span> - Will be played!</span>}
              </div>
            )}

            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
              <Chessboard
                id="VotingChess"
                position={game.fen()}
                onSquareClick={onSquareClick}
                customSquareStyles={{
                  ...moveSquares,
                  ...optionSquares,
                }}
              />
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3>Current Votes: {totalVotes} total</h3>
              {Object.keys(votePercentages).length === 0 ? (
                <p>No votes yet - be the first to vote!</p>
              ) : (
                <div>
                  {Object.entries(votePercentages).map(([move, percentage]) => {
                    const [from, to] = move.split('-');
                    return (
                      <><div
                        key={move}
                        style={{
                          marginBottom: '10px',
                          padding: '5px',
                          border: '1px solid #333',
                          borderRadius: '5px',
                          background: move === selectedMove ? 'rgba(255,255,255,0.05)' : 'transparent'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '3px'
                        }}>
                          <div style={{ fontWeight: 'bold' }}>
                            {formatMove(move)}
                          </div>
                          <div style={{ marginLeft: 'auto', opacity: 0.8 }}>
                            {percentage}% ({votes[move]} votes)
                          </div>
                        </div>
                        <div style={{
                          height: '12px',
                          width: '100%',
                          background: '#222',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}></div>
                        <div style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: percentage > 50 ? '#4caf50' : '#2196f3',
                          transition: 'width 0.3s ease'
                        }} />
                      </div><div style={{ fontSize: '12px', color: '#777', marginTop: '3px' }}>
                          {getPieceName(from)} from {from} to {to}
                        </div></>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedMove && (
              <>
              <div style={{
                marginTop: '20px',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '5px'
              }}>

              </div>
                <p>Your vote: <strong>{formatMove(selectedMove)}</strong></p>
              </>
            )}

            <p style={{ marginTop: '20px', fontSize: '14px', color: '#777' }}></p>
          </>
        )}
        {joined && (
          <div style={{ 
            position: 'fixed', 
            top: '20px', 
            right: '20px',
            background: 'rgba(0,0,0,0.8)',
            padding: '15px',
            borderRadius: '10px',
            zIndex: 1000
          }}>
            <h3>Top Moves</h3>
            {topMoves.map((move, index) => (
              <div key={move.move} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '5px',
                background: index === 0 ? 'rgba(76, 175, 80, 0.3)' : 'transparent'
              }}>
                <span>{formatMove(move.move)}</span>
                <span>{move.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}