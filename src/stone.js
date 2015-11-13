"use strict";

import _ from "underscore";

export default class Stone {
  constructor(move) {
    // let obj = arguments.length > 0 ? arguments[0] : {};
    // _.defaults(this, obj);
    if (move.B) {
      this.color = "B";
      this.coords = move.B;
    } else if (move.W) {
      this.color = "W";
      this.coords = move.W;
    }
  }
}
