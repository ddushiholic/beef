import { moveScroll, throttle } from './helpers';

export default class {
  constructor(layoutView) {
    this.layoutView = layoutView;
    // this.scrollerView = scrollerView;
  }

  setView() {
    this.layoutView.bind('load');

    // this.scrollerView
    //   .bind('click')
    //   .bind('hide')
    //   .on('@move', (e) => this.moveScroller(e.detail.direction));

    // delegate('body', 'a', 'click', (e) => e.preventDefault());
  }

  resizeView() {
    throttle(this.layoutView.bind('load'));
  }

  moveScroller(direction) {
    direction === 'up' ? moveScroll(0) : moveScroll(document.body.clientHeight);
  }
}
