"use strict";

var _ = require("underscore");

import Board from "./board";

export class InvalidMoveException extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "InvalidMoveException";
    Error.captureStackTrace(this, "InvalidMoveException");
  }
}

function validateStoneInBounds(board, move) {
  if (move.B && coordinatesOutOfBounds(board, move.B)) {
    throw new InvalidMoveException(`move out of bounds: ${move.B}`);
  }
  if (move.W && coordinatesOutOfBounds(board, move.W)) {
    throw new InvalidMoveException(`move out of bounds: ${move.W}`);
  }
}

function coordinatesOutOfBounds(board, coords) {
  let minChar = "a".charCodeAt();
  let maxChar = "a".charCodeAt() + board.boardSize - 1;

  return minChar > coords.charCodeAt(0) ||
         maxChar < coords.charCodeAt(0) ||
         minChar > coords.charCodeAt(1) ||
         maxChar < coords.charCodeAt(1);
}

export function getNeighbors(board, coords) {
  return _.filter([
    coords.charAt(0) + String.fromCharCode(coords.charCodeAt(1) + 1),
    coords.charAt(0) + String.fromCharCode(coords.charCodeAt(1) - 1),
    String.fromCharCode(coords.charCodeAt(0) - 1) + coords.charAt(1),
    String.fromCharCode(coords.charCodeAt(0) + 1) + coords.charAt(1)
  ], coords => !coordinatesOutOfBounds(board, coords));
}

export function placeStones(board) {
  let moves = _.flatten(arguments).slice(1);

  for (let move of moves) {
    validateStoneInBounds(board, move);
  }

  return new Board(board, {
    stones: _.extend({}, board.stones, ..._.map(moves, _.invert)),
    currentTurn: board.currentTurn === "B" ? "W" : "B",
    previous: board
  });
}

export function removeStones(board, stones) {
  if (stones.length === 0) { return board }

  return new Board(board, {
    stones: _.omit(board.stones, _.keys(stones)),
  });
}

function getStone(board, coords) {
  return {[coords]: board.stones[coords]};
}

function findKills(board, stone) {
  let color = _.keys(stone)[0];
  let coords = stone[color];
  let opponent = color === "B" ? "W": "B";

  let neighbors = getNeighbors(board, coords);
  let groups = _.chain(neighbors)
    .filter(n => board.stones[n] === opponent) // find neighboring opponent stones
    .map(coords => getStone(board, coords))
    .map(stone => findDeadStones(board, stone))
    .value();

  return _.extend({}, ...groups);
}

export function findDeadStones(board, group) {
  let color = _.values(group)[0];

  let neighbors = _.chain(group)
    .keys() // keys are the coordinates
    .map(coords => getNeighbors(board, coords)) // find neighbors for all stones in group
    .flatten() // flatten list of lists (neighbors)
    .filter(coords => !group[coords]) // filter out stones that are already in group
    .value()

  // if we find a null (empty) neighbor, we are alive.
  if (_.any(neighbors, n => !board.stones[n])) {
    return {};
  }

  let friendlyNeighbors = _.chain(neighbors)
    .filter(coords => board.stones[coords] === color) // match similar colors
    .map(coords => getStone(board, coords))
    .reduce((left, right) => _.extend({}, left, right))
    .value()

  // if there were no friendly neighbors, we"re dead!
  if (!friendlyNeighbors) {
    return group;
  }

  // call self with friendly neighbors added to queue and stone added to group.
  return findDeadStones(board, _.extend({}, group, friendlyNeighbors));
}

export function playMove(board, move) {
  let color = _.keys(move)[0];
  let coords = move[color];

  // make sure there isn"t a stone already there
  if (board.stones[coords]) {
    throw new InvalidMoveException(`stone already at (${coords})`);
  }

  // validate current player
  if (board.currentTurn !== color) {
    throw new InvalidMoveException(`out of turn: current turn is ${board.currentTurn}`);
  }

  // place the new stone
  var newBoard = placeStones(board, move);

  // find dead stones and remove them
  let kills = findKills(newBoard, move);
  newBoard = removeStones(newBoard, kills);

  // check suicide
  if (checkSuicide(newBoard, move)) {
    throw new InvalidMoveException("stone placed in suicide");
  }

  // check ko (note: no need to check ko if there were no kills)
  if (kills && !_.isEmpty(kills) && checkKo(newBoard)) {
    throw new InvalidMoveException("move violates rule of ko");
  }

  return newBoard;
}

function checkSuicide(board, move) {
  let stone = _.invert(move);
  return !_.isEmpty(findDeadStones(board, stone))
}

function checkKo(board) {
  var oldBoard = board.previous;
  while (oldBoard) {
    if (_.isEqual(_.omit(board, "previous"), _.omit(oldBoard, "previous"))) {
      return true;
    }
    oldBoard = oldBoard.previous;
  }
}
