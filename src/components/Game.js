import { useEffect, useReducer } from 'react';

import PlayerHand from './PlayerHand';
import './Game.css';
import dealer_win from '../dealer_win_1300.png';
import dealer_lose from '../dealer_lose_1300.png';
import no_winner from '../no_winner_1300.png';

//constants
const SHAPES = ['h', 'd', 'c', 's'];
const VALUES = [
  'a',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'j',
  'q',
  'k',
];
const valueToNum = { j: 10, q: 10, k: 10 };
const acesCountToPossibleValuesMap = new Map();
acesCountToPossibleValuesMap.set(1, [11, 1]);
acesCountToPossibleValuesMap.set(2, [12, 2]);
acesCountToPossibleValuesMap.set(3, [13, 3]);
acesCountToPossibleValuesMap.set(4, [14, 4]);
const players = ['p', 'd'];
const resultsMessageToAvatarSrc = {
  'There were no winners.': no_winner,
  'You won!': dealer_lose,
  'You lost.': dealer_win,
};

// util functions
//create a deck (ordered)
const createDeck = () => {
  let newDeck = [];
  SHAPES.forEach((s) => {
    VALUES.forEach((v) => {
      let card = `${s}${v}`;
      newDeck.push(card);
    });
  });
  return newDeck;
};

//shuffling on each new round
const shuffleDeck = (deck) => {
  const shuffledDeck = [];
  const copyDeck = deck.slice(0);

  while (copyDeck.length) {
    let curLen = copyDeck.length;
    let randIdx = Math.floor(Math.random() * curLen);
    let removedCard = copyDeck.splice(randIdx, 1);
    shuffledDeck.push(removedCard[0]);
  }
  return shuffledDeck;
};

//array of card strings
const doPlayerCardsContainAce = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].indexOf('a') > -1) {
      return true;
    }
  }
  return false;
};

const reorderPlayerCards = (cards) => {
  if (!doPlayerCardsContainAce(cards)) {
    return { reorderedCards: cards, numberAces: 0 };
  }
  let reorderedCards = [];
  let numberAces = 0;
  cards.forEach((card) => {
    if (card[card.length - 1] === 'a') {
      reorderedCards.push(card);
      numberAces += 1;
    } else {
      reorderedCards.unshift(card);
    }
  });

  return { reorderedCards, numberAces };
};

//use for regular player
const playerGetHandValue = (cards) => {
  let totalValue = 0;
  let { reorderedCards, numberAces } = reorderPlayerCards(cards);

  for (let i = 0; i < reorderedCards.length; i++) {
    let valueStr = reorderedCards[i].slice(1);
    let valueNum;
    if (isNaN(valueStr)) {
      if (valueToNum[valueStr]) {
        valueNum = valueToNum[valueStr];
      } else if (valueStr === 'a') {
        let acesPossibleValues = acesCountToPossibleValuesMap.get(numberAces);
        for (let j = 0; j < acesPossibleValues.length; j++) {
          if (acesPossibleValues[j] + totalValue <= 21) {
            valueNum = acesPossibleValues[j];
            return totalValue + valueNum;
          } else if (
            acesPossibleValues[j] + totalValue > 21 &&
            j === acesPossibleValues.length - 1
          ) {
            valueNum = acesPossibleValues[j];
            return totalValue + valueNum;
          }
        }
      }
    } else {
      valueNum = parseInt(valueStr, 10);
    }
    totalValue += valueNum;
  }
  return totalValue;
};

const initialDeal = (shuffledDeck) => {
  let dealerCards = [];
  let playerCards = [];
  for (let i = 0; i < players.length * 2; i++) {
    let card = shuffledDeck[i];
    let p = i < players.length ? players[i] : players[i % players.length];
    if (p === 'p') {
      dealerCards.push(card);
    }
    if (p === 'd') {
      playerCards.push(card);
    }
  }
  return {
    p: playerCards,
    d: dealerCards,
    shuffledDeck: shuffledDeck.slice(players.length * 2),
  };
};

const dealerGetHandValue = (cards) => {
  let totalValue = 0;
  let { reorderedCards, numberAces } = reorderPlayerCards(cards);

  for (let i = 0; i < reorderedCards.length; i++) {
    let valueStr = reorderedCards[i].slice(1);
    let valueNum;
    if (isNaN(valueStr)) {
      if (valueToNum[valueStr]) {
        valueNum = valueToNum[valueStr];
      } else if (valueStr === 'a') {
        let acesPossibleValues = acesCountToPossibleValuesMap.get(numberAces);
        for (let j = 0; j < acesPossibleValues.length; j++) {
          if (
            acesPossibleValues[j] + totalValue >= 17 &&
            acesPossibleValues[j] + totalValue <= 21
          ) {
            valueNum = acesPossibleValues[j];
            return totalValue + valueNum;
          } else if (
            acesPossibleValues[j] + totalValue > 21 &&
            j === acesPossibleValues.length - 1
          ) {
            valueNum = acesPossibleValues[j];
            return totalValue + valueNum;
          } else if (acesPossibleValues[j] + totalValue < 17) {
            valueNum = acesPossibleValues[j];
            return totalValue + valueNum;
          }
        }
      }
    } else {
      valueNum = parseInt(valueStr, 10);
    }
    totalValue += valueNum;
  }
  return totalValue;
};

const getWinnersLosers = (playerCardTotals) => {
  let losers = [];
  let winners = [];

  if (playerCardTotals['p'] === 21 && playerCardTotals['d'] === 21) {
    return { losers, winners };
  }
  if (playerCardTotals['d'] <= 21) {
    if (
      playerCardTotals['p'] < playerCardTotals['d'] ||
      playerCardTotals['p'] > 21
    ) {
      losers.push('p');
      winners.push('d');
    }
  }
  if (playerCardTotals['p'] <= 21) {
    if (
      playerCardTotals['d'] < playerCardTotals['p'] ||
      playerCardTotals['d'] > 21
    ) {
      losers.push('d');
      winners.push('p');
    }
  }
  return { losers, winners };
};

const getResultsMessage = (state) => {
  let { losers, winners } = state.winnersLosers;
  if (losers.length === 0 && winners.length === 0) {
    return `There were no winners.`;
  }
  if (winners.indexOf('p') > -1) {
    return `You won!`;
  }
  if (losers.indexOf('p') > -1) {
    return `You lost.`;
  }
};

const initialState = {
  shuffledDeck: [],
  playerHands: {
    d: [],
    p: [],
  },
  playerCardTotals: { d: 0, p: 0 },
  gameStatus: -1,
  isDealerCardHidden: true,
  displayResults: true,
  winnersLosers: {
    losers: [],
    winners: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'startNewGame': {
      const { p, d, shuffledDeck } = initialDeal(shuffleDeck(createDeck()));
      const playerCardTotals = {
        d: dealerGetHandValue(d),
        p: playerGetHandValue(p),
      };
      return {
        ...initialState,
        shuffledDeck,
        playerHands: {
          p,
          d,
        },
        playerCardTotals,
        winnersLosers: getWinnersLosers(playerCardTotals),
        gameStatus: 1,
      };
    }
    case 'dealOneCardToPlayer': {
      const newCard = state.shuffledDeck[0];
      const playersUpdatedHand = [...state.playerHands[action.player], newCard];
      const playersUpdatedScore =
        action.player === 'p'
          ? playerGetHandValue(playersUpdatedHand)
          : dealerGetHandValue(playersUpdatedHand);

      const playerCardTotals = {
        ...state.playerCardTotals,
        [action.player]: playersUpdatedScore,
      };

      return {
        ...state,
        shuffledDeck: state.shuffledDeck.slice(1),
        playerHands: {
          ...state.playerHands,
          [action.player]: playersUpdatedHand,
        },
        playerCardTotals,
        winnersLosers: getWinnersLosers(playerCardTotals),
        gameStatus:
          playersUpdatedScore >= 21 ? state.gameStatus + 1 : state.gameStatus,
      };
    }

    case 'playerIsDone': {
      return {
        ...state,
        gameStatus: action.player === 'p' ? 2 : 3,
        isDealerCardHidden: false,
      };
    }

    case 'closeDisplayResults': {
      return {
        ...state,
        displayResults: false,
      };
    }

    default:
      throw new Error('Unknown action');
  }
}

const Game = ({ isGamePaused }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startGameClick = () => {
    dispatch({ type: 'startNewGame' });
  };

  const dealPlayerCardClick = () => {
    dispatch({ type: 'dealOneCardToPlayer', player: 'p' });
  };

  const playerIsDoneClick = () => {
    dispatch({ type: 'playerIsDone', player: 'p' });
  };

  const closeDisplayResultsClick = () => {
    dispatch({ type: 'closeDisplayResults' });
  };

  useEffect(() => {
    if (state.gameStatus === 2) {
      if (state.playerCardTotals.d <= 16 && state.playerCardTotals.p <= 21) {
        dispatch({
          type: 'dealOneCardToPlayer',
          player: 'd',
        });
      } else {
        dispatch({ type: 'playerIsDone', player: 'd' });
      }
    }
  }, [state.playerCardTotals, state.gameStatus]);

  let resultsMessage = getResultsMessage(state);
  console.log('resultsMessage', resultsMessage);
  let avatarSrc = resultsMessageToAvatarSrc[resultsMessage];
  console.log('avatarSrc', avatarSrc);

  return (
    <div className="game_container">
      <div className="game_header">
        <h1>Game</h1>
        {(state.gameStatus === -1 || state.gameStatus === 3) && (
          <div className="btn_container_game_header">
            <button onClick={startGameClick} className="btn">
              Start New Game
            </button>
          </div>
        )}
        {state.gameStatus === 1 && (
          <div className="btn_container_game_header">
            <button onClick={dealPlayerCardClick} className="btn">
              Hit
            </button>
            <button onClick={playerIsDoneClick} className="btn">
              Stay
            </button>
          </div>
        )}
      </div>
      <PlayerHand cards={state.playerHands.p} player="p" />
      <PlayerHand
        cards={state.playerHands.d}
        player="d"
        isDealerCardHidden={state.isDealerCardHidden}
      />
      {state.gameStatus === 3 && state.displayResults === true && (
        <div className="results_container">
          <div className="btn_close_container">
            <button className="btn_close" onClick={closeDisplayResultsClick}>
              X
            </button>
          </div>
          <div className="avatar_dealer">
            <img
              src={avatarSrc}
              alt="dealer avatar"
              className="img_avatar_dealer"
            />
          </div>
          <div>
            <h2 className="results_message">{resultsMessage}</h2>
          </div>
          <div className="text_score">
            Your score: {state.playerCardTotals.p}
          </div>
          <div className="text_score">
            Dealer's score: {state.playerCardTotals.d}
          </div>
          <div className="btn_spacer">
            <button onClick={startGameClick} className="btn btn_dark">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
