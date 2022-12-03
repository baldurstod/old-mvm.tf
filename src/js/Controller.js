export const Controller = new (function () {
	class Controller extends EventTarget {
		constructor() {
			super();
		}
	}
	return Controller;
}());
