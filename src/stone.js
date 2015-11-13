"use strict";

import _ from "underscore";

export default class Stone {
  constructor() {
    let obj = arguments.length > 0 ? arguments[0] : {};
    _.defaults(this, obj);
  }
}
