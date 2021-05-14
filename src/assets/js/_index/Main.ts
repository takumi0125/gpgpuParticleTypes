import MainGL from './webgl/MainGL';

export default class Index {
  protected mainGL!: MainGL;

  constructor() {
    this.init();
  }

  protected async init() {
    const canvas = document.body.querySelector('.js-mainCanvas') as HTMLCanvasElement;
    this.mainGL = new MainGL(canvas.parentElement as HTMLElement, canvas);
    await this.mainGL.init();

    this.onResize = this.onResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onClick = this.onClick.bind(this);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('touchmove', this.onTouchMove);
    canvas.addEventListener('click', this.onClick);

    this.onResize();
    this.mainGL.start();
  }

  protected onResize(e?: Event) {
    this.mainGL.onResize();
  }

  protected onPointerMove(posX: number, posY: number) {
    this.mainGL.onPointerMove(posX, posY);
  }

  protected onMouseMove(e: MouseEvent) {
    this.onPointerMove(e.clientX, e.clientY);
  }

  protected onTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    this.onPointerMove(touch.clientX, touch.clientY);
  }

  protected onClick(e?: MouseEvent) {
    this.mainGL.changeType();
  }
}
