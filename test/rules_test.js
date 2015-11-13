"use strict";

import mocha from "mocha"
import { expect } from "chai"

import Board from "../src/board";
import Stone from "../src/stone";

import { playMove } from "../src/rules";;

describe('rules', () => {
  describe('playMove', () => {
    it('places a stone on the board', () => {
      let board = new Board();
      let new_board = playMove([board], {B: "bc"});
      expect(new_board.stones.bc).to.equal("B");
    });

    it("throws an exception if a stone is played out of bounds", () => {
      let board = new Board();
      let badMove = () => playMove([board], {B: "yz"});
      expect(badMove).to.throw(/out of bounds/);
    })
  });

  // describe('removeStones', () => {
  //   it('does nothing if no stones are being removed', () => {
  //     let stone = new Stone({B: "cc"});
  //     let board = new Board();
  //     let new_board = rules.removeStones(board, stone);
  //
  //     expect(board).to.eql(new_board);
  //   });
  //
  //   it('returns a new board if stones were removed', () => {
  //     let stone = new Stone({x: 3, y: 3, color: black});
  //     let board = new Board({stones: [stone]});
  //     let new_board = rules.removeStones(board, stone);
  //
  //     expect(new_board).to.be.instanceOf(Board);
  //     expect(new_board).to.not.equal(board);
  //   });
  //
  //   it('can remove a single stone', () => {
  //     let stone = new Stone({x: 3, y: 3, color: black});
  //     let board = new Board({stones: [stone]});
  //     let new_board = rules.removeStones(board, stone);
  //
  //     expect(new_board.stones).to.not.include(stone);
  //   });
  //
  //   it('can remove a single stone from a board with 2 stones', () => {
  //     let live_stone = new Stone({x: 3, y: 3, color: black});
  //     let dead_stone = new Stone({x: 2, y: 3, color: white});
  //     let board = new Board({stones: [live_stone, dead_stone]});
  //     let new_board = rules.removeStones(board, dead_stone);
  //
  //     expect(new_board.stones).to.include(live_stone);
  //     expect(new_board.stones).to.not.include(dead_stone);
  //   });
  //
  //   it('can take an array as well as an args list', () => {
  //     let live_stone = new Stone({x: 3, y: 3, color: black});
  //     let dead_stone = new Stone({x: 2, y: 3, color: white});
  //     let board = new Board({stones: [live_stone, dead_stone]});
  //     let new_board = rules.removeStones(board, [dead_stone]);
  //
  //     expect(new_board.stones).to.include(live_stone);
  //     expect(new_board.stones).to.not.include(dead_stone);
  //   });
  // });
  //
  // describe('findDeadStones', () => {
  //   it('returns nothing for a lone live stone', () => {
  //     let stone = new Stone({x: 3, y: 3, color: black});
  //     let board = new Board({stones: [stone]});
  //     expect(rules.findDeadStones(board, stone)).to.eql([]);
  //   });
  //
  //   it('for a single surrounded stone, returns a list with the dead stone', () => {
  //     let dead_stone = new Stone({x: 3, y: 2, color: black});
  //     let board = new Board({stones: [
  //       dead_stone,
  //       new Stone({x: 2, y: 2, color: white}),
  //       new Stone({x: 3, y: 1, color: white}),
  //       new Stone({x: 4, y: 2, color: white}),
  //       new Stone({x: 3, y: 3, color: white})
  //     ]});
  //     expect(rules.findDeadStones(board, dead_stone)).to.eql([dead_stone]);
  //   });
  //
  //   it('for a surrounded group, returns a list with all the dead stones', () => {
  //     let dead_stones = [
  //       new Stone({x: 3, y: 2, color: black}),
  //       new Stone({x: 3, y: 3, color: black})
  //     ];
  //     let board = new Board({stones: dead_stones.concat(
  //       new Stone({x: 2, y: 2, color: white}),
  //       new Stone({x: 3, y: 1, color: white}),
  //       new Stone({x: 4, y: 2, color: white}),
  //       new Stone({x: 4, y: 3, color: white}),
  //       new Stone({x: 3, y: 4, color: white}),
  //       new Stone({x: 2, y: 3, color: white})
  //     )});
  //     expect(rules.findDeadStones(board, dead_stones[0])).to.have.members(dead_stones);
  //   });
  //
  //   it('can find dead stones on the edge', () => {
  //     let dead_stones = [
  //       new Stone({x: 18, y: 8, color: black}),
  //       new Stone({x: 18, y: 9, color: black}),
  //       new Stone({x: 18, y: 10, color: black})
  //     ];
  //     let board = new Board({stones: dead_stones.concat(
  //       new Stone({x: 18, y: 7, color: white}),
  //       new Stone({x: 17, y: 8, color: white}),
  //       new Stone({x: 17, y: 9, color: white}),
  //       new Stone({x: 17, y: 10, color: white}),
  //       new Stone({x: 18, y: 11, color: white})
  //     )});
  //     expect(rules.findDeadStones(board, dead_stones[0])).to.have.members(dead_stones);
  //   });
  // });
});
