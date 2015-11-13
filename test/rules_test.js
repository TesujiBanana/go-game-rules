"use strict";

// var mocha = require('mocha');
// var expect = require('chai').expect;
import mocha from "mocha";
import { expect } from "chai";

var GoRules = require("../src/rules.js");

var emptyBoard = {boardSize: 19, currentTurn: 0, stones: []}

describe('GoRules', function() {
  describe('playMove', function() {
    it('places a stone on the board', function() {
      var board = emptyBoard;
      var stone = {x: 2, y: 3, color: 0};

      var new_board = GoRules.playMove([board], stone);
      expect(new_board.stones).to.include(stone);
    });
  });

  describe('removeStones', function() {
    it('does nothing if no stones are being removed', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var board = new Board();
      var new_board = GoRules.removeStones(board, stone);

      expect(board).to.eql(new_board);
    });

    it('returns a new board if stones were removed', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var board = new Board({stones: [stone]});
      var new_board = GoRules.removeStones(board, stone);

      expect(new_board).to.be.instanceOf(Board);
      expect(new_board).to.not.equal(board);
    });

    it('can remove a single stone', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var board = new Board({stones: [stone]});
      var new_board = GoRules.removeStones(board, stone);

      expect(new_board.stones).to.not.include(stone);
    });

    it('can remove a single stone from a board with 2 stones', function() {
      var live_stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var dead_stone = new Stone({x: 2, y: 3, color: Stone.WHITE});
      var board = new Board({stones: [live_stone, dead_stone]});
      var new_board = GoRules.removeStones(board, dead_stone);

      expect(new_board.stones).to.include(live_stone);
      expect(new_board.stones).to.not.include(dead_stone);
    });

    it('can take an array as well as an args list', function() {
      var live_stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var dead_stone = new Stone({x: 2, y: 3, color: Stone.WHITE});
      var board = new Board({stones: [live_stone, dead_stone]});
      var new_board = GoRules.removeStones(board, [dead_stone]);

      expect(new_board.stones).to.include(live_stone);
      expect(new_board.stones).to.not.include(dead_stone);
    });
  });

  describe('findDeadStones', function() {
    it('returns nothing for a lone live stone', function() {
      var stone = new Stone({x: 3, y: 3, color: Stone.BLACK});
      var board = new Board({stones: [stone]});
      expect(GoRules.findDeadStones(board, stone)).to.eql([]);
    });

    it('for a single surrounded stone, returns a list with the dead stone', function() {
      var dead_stone = new Stone({x: 3, y: 2, color: Stone.BLACK});
      var board = new Board({stones: [
        dead_stone,
        new Stone({x: 2, y: 2, color: Stone.WHITE}),
        new Stone({x: 3, y: 1, color: Stone.WHITE}),
        new Stone({x: 4, y: 2, color: Stone.WHITE}),
        new Stone({x: 3, y: 3, color: Stone.WHITE})
      ]});
      expect(GoRules.findDeadStones(board, dead_stone)).to.eql([dead_stone]);
    });

    it('for a surrounded group, returns a list with all the dead stones', function() {
      var dead_stones = [
        new Stone({x: 3, y: 2, color: Stone.BLACK}),
        new Stone({x: 3, y: 3, color: Stone.BLACK})
      ];
      var board = new Board({stones: dead_stones.concat(
        new Stone({x: 2, y: 2, color: Stone.WHITE}),
        new Stone({x: 3, y: 1, color: Stone.WHITE}),
        new Stone({x: 4, y: 2, color: Stone.WHITE}),
        new Stone({x: 4, y: 3, color: Stone.WHITE}),
        new Stone({x: 3, y: 4, color: Stone.WHITE}),
        new Stone({x: 2, y: 3, color: Stone.WHITE})
      )});
      expect(GoRules.findDeadStones(board, dead_stones[0])).to.have.members(dead_stones);
    });

    it('can find dead stones on the edge', function() {
      var dead_stones = [
        new Stone({x: 18, y: 8, color: Stone.BLACK}),
        new Stone({x: 18, y: 9, color: Stone.BLACK}),
        new Stone({x: 18, y: 10, color: Stone.BLACK})
      ];
      var board = new Board({stones: dead_stones.concat(
        new Stone({x: 18, y: 7, color: Stone.WHITE}),
        new Stone({x: 17, y: 8, color: Stone.WHITE}),
        new Stone({x: 17, y: 9, color: Stone.WHITE}),
        new Stone({x: 17, y: 10, color: Stone.WHITE}),
        new Stone({x: 18, y: 11, color: Stone.WHITE})
      )});
      expect(GoRules.findDeadStones(board, dead_stones[0])).to.have.members(dead_stones);
    });
  });
});
