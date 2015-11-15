"use strict";

import _ from "underscore";

export default class Board {
  constructor() {
    // let obj = arguments.length > 0 ? arguments[0] : {};
    // _.defaults(this, obj, {
    //   boardSize: 19,
    //   currentTurn: "B",
    //   stones: {}}
    // );
    let defaults = {
      boardSize: 19,
      currentTurn: "B",
      stones: {}
    };
    _.extend(this, defaults, ...arguments);
  }
}
