"use strict";

import _ from "underscore";

export default class Board {
  constructor() {
    let defaults = {
      boardSize: 19,
      currentTurn: "B",
      stones: {}
    };
    _.extend(this, defaults, ...arguments);
  }
}
