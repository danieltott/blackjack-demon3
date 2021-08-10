//create a deck (ordered)
const createDeck = (shapes, values) => {
  let newDeck = [];
  shapes.forEach(s => {
    values.forEach(v => {
      let card = `${s}${v}`;
      newDeck.push(card);
    })
  })
  return newDeck;
}

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
}

//array of card strings
const doPlayerCardsContainAce = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].indexOf('a') > -1) {
      return true;
    }
  } 
  return false;
}

const reorderPlayerCards = (cards) => {
  if (!doPlayerCardsContainAce(cards)) {
    return {reorderedCards: cards, numberAces: 0};
  }
  let reorderedCards = [];
  let numberAces = 0;
  cards.forEach(card => {
    if (card[card.length - 1] === 'a') {
      reorderedCards.push(card);
      numberAces += 1;
    } else {
      reorderedCards.unshift(card);
    }
  })

  return {reorderedCards, numberAces};
}

//use for regular player
const playerGetHandValue = (cards, acesCountToPossibleValuesMap, valueToNum) => {
  let totalValue = 0;
  let {reorderedCards, numberAces} = reorderPlayerCards(cards);

  for (let i = 0; i < reorderedCards.length; i++) {
    let valueStr = reorderedCards[i].slice(1);
    let valueNum;
    if (isNaN(valueStr)) {
      if (valueToNum[valueStr]) {
        valueNum = valueToNum[valueStr]
      } else if (valueStr === 'a') {
        let acesPossibleValues = acesCountToPossibleValuesMap.get(numberAces);
        for (let j = 0; j < acesPossibleValues.length; j++) {
          if (acesPossibleValues[j] + totalValue <= 21) {
            valueNum = acesPossibleValues[j];
            return totalValue + valueNum;
          } else if (acesPossibleValues[j] + totalValue > 21 && j === acesPossibleValues.length - 1) {
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
}

export { createDeck, shuffleDeck, doPlayerCardsContainAce, reorderPlayerCards, playerGetHandValue };