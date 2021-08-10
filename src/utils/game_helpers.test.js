import { createDeck, shuffleDeck, doPlayerCardsContainAce, reorderPlayerCards, 
  playerGetHandValue, getWinnersLosers } from './game_helpers';

import { SHAPES, VALUES, valueToNum, acesCountToPossibleValuesMap } from './constants';

describe('game engine tests', () => {

  describe('test reorderPlayerCards()', () => {
    test('reorder 3 cards', () => {
      expect(reorderPlayerCards(['ca', 'c9', 'sj']).reorderedCards).toEqual(['sj', 'c9', 'ca']);
    });
    test('reorder 4 cards', () => {
      expect(reorderPlayerCards(['ca', 'c9', 'da', 'sj']).reorderedCards).toEqual(['sj', 'c9', 'ca', 'da']);
    });
    test('reorder 6 cards', () => {
      expect(reorderPlayerCards(['sa', 'ha', 'ca', 'c9', 'da', 'sj']).reorderedCards).toEqual(['sj', 'c9', 'sa', 'ha', 'ca', 'da']);
    });
  });

  describe('test playerGetHandValue()', () => {
    test('2 card hand', () => {
      expect(playerGetHandValue(['ca', 'sj'], acesCountToPossibleValuesMap, valueToNum)).toEqual(21);
    });
    test('3 card hand', () => {
      expect(playerGetHandValue(['ca', 'sj', 'c9'], acesCountToPossibleValuesMap, valueToNum)).toEqual(20);
    });
    test('4 card hand', () => {
      expect(playerGetHandValue(['ca', 'ha', 'sj', 'c9'], acesCountToPossibleValuesMap, valueToNum)).toEqual(21);
    });
    test('5 card hand', () => {
      expect(playerGetHandValue(['ca', 'ha', 'sj', 'c9', 'd3'], acesCountToPossibleValuesMap, valueToNum)).toEqual(24);
    });
    test('5 card hand b', () => {
      expect(playerGetHandValue(['ca', 'ha', 'da', 'sa', 'c9'], acesCountToPossibleValuesMap, valueToNum)).toEqual(13);
    });
  });

  describe('test doPlayerCardsContainAce()', () => {
    test('one ace', () => {
      expect(doPlayerCardsContainAce(['ca', 'ha', 'sj', 'c9'])).toBe(true);
    });
    test('no ace', () => {
      expect(doPlayerCardsContainAce(['sj', 'c9'])).toBe(false);
    });
    test('one ace at end', () => {
      expect(doPlayerCardsContainAce(['sj', 'c9', 'ca'])).toBe(true);
    });
  });


});

//TESTING
// reorderPlayerCards(['ca', 'ha', 'sj', 'c9']); // {reorderedCards: ['sj', 'c9', 'ca', 'ha'], numberAces: 2}
// reorderPlayerCards(['da', 'ca', 'ha', 'sj', 'c9']); // {reorderedCards: ['sj', 'c9', 'da', 'ca', 'ha'], numberAces: 3}
// console.log(reorderPlayerCards(['c5', 'c9',  'd2'])); // {reorderedCards: ['c5', 'c9',  'd2'], numberAces: 0}

// console.log(isPlayerBust(['c3', 'sk', 'hq'])); //true passing
// console.log(isPlayerBust(['ca', 'sj'])); //false passing
// console.log(isPlayerBust(['ca', 'sj', 'c9'])); //false passing
// console.log(isPlayerBust(['ca', 'ha', 'sj', 'c9', 'd3'])); //true passing
// console.log(isPlayerBust(['ca', 'ha', 'sj', 'c9'])); //false passing
// console.log(isPlayerBust(['ca', 'ha', 'da', 'sa', 'c9'])); //false passing

//TEST evaluteWinnerUser

//TEST resetGame