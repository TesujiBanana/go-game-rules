'use strict';

var _ = require('underscore');

import Stone from "./stone";
import Board from "./board";

export class InvalidMoveException extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "InvalidMoveException"; //this.constructor.name;
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
  let maxChar = 'a'.charCodeAt() + board.boardSize - 1;

  return minChar > coords.charCodeAt(0) ||
         maxChar < coords.charCodeAt(0) ||
         minChar > coords.charCodeAt(1) ||
         maxChar < coords.charCodeAt(1);
}

// stoneAt: function(board, x, y) {
//   if (this.coordinatesOutOfBounds(board, x, y)) { return undefined }
//   return _.first(_.where(board.stones, {x: x, y: y})) || null;
// },
// getNeighboringStones: function(board, stone) {
//   return [
//     this.stoneAt(board, stone.x - 1, stone.y),
//     this.stoneAt(board, stone.x, stone.y + 1),
//     this.stoneAt(board, stone.x + 1, stone.y),
//     this.stoneAt(board, stone.x, stone.y - 1)
//   ];
// },
// getBoardOverlay: function(board, new_stones) {
//   var stones = (new_stones !== undefined) ? new_stones : board.stones;
//   return _.object(
//     stones.map(function(stone) {
//       return stone.x + (board.boardSize * stone.y);
//     }.bind(this)),
//     stones
//   );
// },

export function placeStones(board) {
  // var args = _.flatten(arguments).slice(1);
  let moves = _.flatten(arguments).slice(1);


  for (let move of moves) {
    validateStoneInBounds(board, move);
  }

  return new Board({
    boardSize: board.boardSize,
    stones: _.extend({}, board.stones, ..._.map(moves, _.invert)),
    currentTurn: 1 - board.currentTurn
  });
}

// removeStones: function(board) {
//   var args = _.flatten(arguments).slice(1);
//
//   var valid_stones = _.filter(args, function(stone) {
//     return (
//       !this.coordinatesOutOfBounds(board, stone.x, stone.y) &&
//       stone === this.stoneAt(board, stone.x, stone.y)
//     );
//   }.bind(this));
//
//   if (valid_stones.length === 0) { return board }
//
//   return new Board({
//     boardSize: board.boardSize,
//     stones: _.values(_.omit(this.getBoardOverlay(board, board.stones), _.keys(this.getBoardOverlay(board, valid_stones))))
//   });
// },
// findKills: function(board, stone) {
//   return _.reduce(
//     this.getNeighboringStones(board, stone).filter(function(neighbor_stone) {
//       return neighbor_stone && (stone.color !== neighbor_stone.color);
//     }),
//     function(dead_stones, seed_stone) {
//       if (_.contains(dead_stones, seed_stone)) { return dead_stones }
//       return dead_stones.concat(this.findDeadStones(board, seed_stone));
//     }.bind(this),
//     []
//   );
// },
// findDeadStones: function(board, stone) {
//   var _findDeadStones = function(board, queue, group) {
//     // if there is nothing left to check, we are dead.
//     if (queue.length === 0) { return group }
//
//     var stone = queue[0],
//         rest = queue.slice(1),
//         neighbors = this.getNeighboringStones(board, stone);
//
//     // if we find a null (empty) neighbor, we are alive.
//     if (neighbors.indexOf(null) >= 0) { return [] }
//
//     // call self with friendly neighbors added to queue and stone added to group.
//     return _findDeadStones(board,
//       rest.concat(neighbors.filter(function(neighbor_stone) {
//         return (
//           (neighbor_stone && stone.color === neighbor_stone.color) &&
//           !_.contains(group, neighbor_stone)
//         );
//       })),
//       group.concat(stone)
//     );
//   }.bind(this);
//   return _findDeadStones(board, [stone], []);
// },
// getBoard: function(board_history, moves) {
//   if (moves.length === 0) {
//     return board_history.slice(-1)[0];
//   }
//   else {
//     var new_board = this.playMove(board_history, moves[0]);
//     return this.getBoard(
//       board_history.concat(new_board),
//       moves.slice(1)
//     );
//   }
// },

export function playMove(board_history, move) {
  var old_board = board_history.slice(-1)[0]

  // make sure there isn't a stone already there
  // if (this.stoneAt(old_board, move.x, move.y)) {
    // throw new InvalidMoveException('stone already at (' + move.x + ', ' + move.y + ')');
  // }

  // TODO: validate current player
  // console.log(old_board.currentTurn, move.color);

  // create and place the new stone
  // var new_stone = new Stone(move);
  var new_board = placeStones(old_board, move); //new_stone);

  // find dead stones and remove them
  // var kills = this.findKills(new_board, new_stone);
  // console.log(kills);
  // new_board = this.removeStones(new_board, kills);

  // check suicide
  // if (this.checkSuicide(new_board, new_stone)) {
  //   throw new InvalidMoveException('stone placed in suicide');
  // }

  // check ko (note: no need to check ko if there were no kills)
  // if (kills && kills.length > 0 && this.checkKo(board_history, new_board)) {
  //   throw new InvalidMoveException('move violates rule of ko');
  // }

  // create a new game state with the new board and the turn set
  return new_board;
}

// checkSuicide: function(board, new_stone) {
//   return this.findDeadStones(board, new_stone).length > 0;
// },


// checkKo: function(board_history, new_board) {
//   return board_history.some(function(old_board) {
//     // TODO: bloom filter ...
//     return new_board.stones.length === old_board.stones.length &&
//       _.isEqual(this.getBoardOverlay(old_board), this.getBoardOverlay(new_board));
//   }.bind(this));
// }
