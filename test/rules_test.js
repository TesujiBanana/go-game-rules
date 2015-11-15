"use strict";

import mocha from "mocha"
import { expect } from "chai"

import _ from "underscore";

import Board from "../src/board";

import { playMove, removeStones, getNeighbors, findDeadStones } from "../src/rules";;

describe("rules", () => {
  describe("playMove", () => {
    it("places a stone on the board", () => {
      let board = new Board();
      let newBoard = playMove(board, {B: "bc"});
      expect(newBoard.stones.bc).to.equal("B");
    });

    it("throws an exception if intersection is already occupied", () => {
      let board = new Board({stones: {bc: "B"}});
      let badMove = () => playMove(board, {W: "bc"});
      expect(badMove).to.throw(/stone already at/);
    });

    it("throws an exception if move is out of turn", () => {
      let board = new Board({stones: {bc: "B"}, currentTurn: "W"});
      let badMove = () => playMove(board, {B: "cc"});
      expect(badMove).to.throw(/out of turn/);
    });

    it("throws an exception if a stone is played out of bounds", () => {
      let board = new Board();
      let badMove = () => playMove(board, {B: "yz"});
      expect(badMove).to.throw(/out of bounds/);
    });

    it("handles kills and returns a new board", () => {
      //   a b c d e f g
      // a . . . . . . .
      // b . . . . . . .
      // c . . . b w . .
      // d . . b w b w .
      // e . . . . . . .
      // f . . . . . . .
      let board = new Board({
        stones: {cd: "B", dd: "W", dc: "B", ec: "W", ed: "B", fd: "W"}
      });

      let newBoard = playMove(board, {B: "de"});
      expect(newBoard.stones).to.eql({cd: "B", dc: "B", ec: "W", ed: "B", fd: "W", de: "B"});
    });

    it("throws an exception if a stone is played in suicide", () => {
      //   a b c d e f g
      // a . . . . . . .
      // b . . . . . . .
      // c . . . b w . .
      // d . . b . b w .
      // e . . . b . . .
      // f . . . . . . .
      let board = new Board({
        stones: {cd: "B", dc: "B", ec: "W", ed: "B", fd: "W", de: "B"},
        currentTurn: "W"
      });
      let suicide = () => playMove(board, {W: "dd"});
      expect(suicide).to.throw(/suicide/);
    });

    it("throws an exception if a move violates ko", () => {
      //   a b c d e f g
      // a . . . . . . .
      // b . . . . . . .
      // c . . . b w b .
      // d . . b . b w .
      // e . . . b w . .
      // f . . . . . . .
      let board = new Board({
        stones: {cd: "B", dc: "B", ec: "W", ed: "B", fd: "W", de: "B", ee: "W", fc: "B"},
        currentTurn: "W"
      });

      let newBoard = playMove(board, {W: "dd"});
      let ko = () => playMove(newBoard, {B: "ed"});
      expect(ko).to.throw(/move violates rule of ko/);
    });
  });

  describe("removeStones", () => {
    it("does nothing if no stones are being removed", () => {
      let board = new Board();
      let newBoard = removeStones(board, {cc: "B"});
      expect(board).to.eql(newBoard);
    });

    it("returns a new board if stones were removed", () => {
      let board = new Board({stones: {cc: "B"}});
      let newBoard = removeStones(board, {cc: "B"});

      expect(newBoard).to.be.instanceOf(Board);
      expect(newBoard).to.not.equal(board);
    });

    it("can remove a single stone", () => {
      let board = new Board({stones: {cc: "B"}});
      let newBoard = removeStones(board, {cc: "B"});

      expect(newBoard.stones).to.not.have.any.keys("cc");
    });

    it("can remove a single stone from a board with 2 stones", () => {
      let live_stone = {cc: "B"};
      let dead_stone = {bc: "W"};
      let board = new Board({stones: _.extend({}, live_stone, dead_stone)});
      let newBoard = removeStones(board, dead_stone);

      expect(newBoard.stones).to.have.all.keys("cc");
      expect(newBoard.stones).to.not.have.any.keys("bc");
    });

  //   it("can take an array as well as an args list", () => {
  //     let live_stone = new Stone({x: 3, y: 3, color: black});
  //     let dead_stone = new Stone({x: 2, y: 3, color: white});
  //     let board = new Board({stones: [live_stone, dead_stone]});
  //     let newBoard = rules.removeStones(board, [dead_stone]);
  //
  //     expect(newBoard.stones).to.include(live_stone);
  //     expect(newBoard.stones).to.not.include(dead_stone);
  //   });
  });

  describe("getNeighbors", () => {
    it("returns 4 neighbors for a stone in the middle of the board", () => {
      let board = new Board({stones: {cc: "B"}});
      expect(getNeighbors(board, "cc")).to.have.same.members(["cd", "cb", "bc", "dc"]);
    });

    it("returns 3 neighbors for a stone on the edge fo the board", () => {
      let board = new Board();
      expect(getNeighbors(board, "ca")).to.have.same.members(["cb", "ba", "da"]);
    });

    it("returns 3 neighbors for a stone on the far edge fo the board", () => {
      let board = new Board();
      expect(getNeighbors(board, "fs")).to.have.same.members(["fr", "es", "gs"]);
    });

    it("returns 3 neighbors for a stone on the edge fo the board", () => {
      let board = new Board();
      expect(getNeighbors(board, "aa")).to.have.same.members(["ab", "ba"]);
    });

  });

  describe("findDeadStones", () => {
    it("returns nothing for a lone live stone", () => {
      let board = new Board({stones: {cc: "B"}});
      expect(findDeadStones(board, {cc: "B"})).to.eql({});
    });

    it("for a single surrounded stone, returns the dead stone", () => {
      let deadStone = {cb: "B"};
      let board = new Board({stones: _.extend({},
        deadStone,
        {bb: "W", ca: "W", db: "W", cc: "W"}
      )})
      expect(findDeadStones(board, deadStone)).to.eql(deadStone);
    });

    it("can make a ponnuki", () => {
      let board = new Board({stones: {cd: "B", dd: "W", dc: "B", ec: "W", ed: "B", fd: "W", de: "B"}});
      expect(findDeadStones(board, {dd: "W"})).to.eql({dd: "W"})

    })

    it("for a surrounded group, returns all the dead stones", () => {
      let deadStones = {cb: "B", cc: "B"};
      let board = new Board({stones: _.extend({},
        deadStones,
        {bb: "W", ca: "W", db: "W", dc: "W", cd: "W", bc: "W"}
      )});
      expect(findDeadStones(board, {cb: "B"})).to.eql(deadStones);
    });

    it("can find dead stones on the edge", () => {
      let deadStones = {sh: "B", si: "B", sj: "B"};
      let board = new Board({stones: _.extend({},
        deadStones,
        {sg: "W", rh: "W", ri: "W", rj: "W", sk: "W"}
      )});
      expect(findDeadStones(board, {si: "B"})).to.eql(deadStones);
    });
  });
});
