import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera' ;
import { WebGL1Renderer    } from 'three/src/renderers/WebGL1Renderer'  ;

import WebGLBase from './WebGLBase';
import Particle from './Particle';

export default class MainGL extends WebGLBase {
  protected particle!: Particle;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement | null = null) {
    if(!WebGLBase.isWebGLAvailable) {
      alert('not supported');
      throw new Error('not supported');
    }
    super(container, canvas);
  }

  protected initCamera() {
    super.initCamera();
    (this.camera as PerspectiveCamera).matrixAutoUpdate = false;
  }

  protected async initContents() {
    this.particle = new Particle(this.renderer as WebGL1Renderer);
    await this.particle.init();
    this.scene?.add(this.particle);
  }

  protected onResizeContents() {
    this.particle.onResize();
  }

  public onPointerMove(posX: number, posY: number) {
    this.particle.onPointerMove(posX, posY);
  }

  public beforeRenderContents() {
    this.particle.update(this.time);
  }

  public changeType() {
    this.particle.changeType();
  }
}
