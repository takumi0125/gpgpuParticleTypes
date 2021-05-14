import { WebGLRenderer, WebGLRendererParameters } from 'three/src/renderers/WebGLRenderer';
import { WebGL1Renderer    } from 'three/src/renderers/WebGL1Renderer'  ;
import { Camera            } from 'three/src/cameras/Camera'            ;
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera' ;
import { Color             } from 'three/src/math/Color'                ;
import { Scene             } from 'three/src/scenes/Scene'              ;
import { Texture           } from 'three/src/textures/Texture'          ;
import { TextureLoader     } from 'three/src/loaders/TextureLoader'     ;
import { Object3D          } from 'three/src/core/Object3D'             ;
import { Mesh              } from 'three/src/objects/Mesh'              ;
import { Material          } from 'three/src/materials/Material'        ;
import { Vector2           } from 'three/src/math/Vector2'              ;

import {
  Wrapping,
  TextureFilter,
  ClampToEdgeWrapping,
  LinearFilter,
} from 'three/src/constants';

import { WEBGL } from 'three/examples/jsm/WebGL';

type TextreLoaderOptions = {
  wrapS?: Wrapping,
  wrapT?: Wrapping,
  minFilter?: TextureFilter,
  magFilter?: TextureFilter,
  generateMipmaps?: boolean
}

export default class WebGLBase {
  protected static isCheckedWebGLAvailable: boolean = false;
  protected static _isWebGLAvailable: boolean = false;

  public container!: HTMLElement;
  protected canvas!: HTMLCanvasElement | null;

  protected pixelRatio: number = 1;

  protected renderer?: WebGLRenderer;
  protected scene?: Scene;
  protected camera?: Camera;

  protected width: number = 0;
  protected height: number = 0;
  protected startTime: number = 0;
  protected time: number = 0;
  protected frameCountsPerRender: number = 1;
  protected renderCount = 0;

  protected isRunning: boolean = false;
  protected animationId: number = 0;
  protected isDisposed: boolean = false;
  protected isInited: boolean = false;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement | null = null) {
    this.container = container;
    this.canvas = canvas;
  }

  public static get isWebGLAvailable() {
    // return false; // for debug
    if(this.isCheckedWebGLAvailable) return this._isWebGLAvailable;
    this._isWebGLAvailable = WEBGL.isWebGLAvailable();
    this.isCheckedWebGLAvailable = true;
    return this._isWebGLAvailable;
  }

  public static async initImgTexture(
    imgSrc: string,
    options: TextreLoaderOptions | null = null
  ): Promise<Texture>  {
    return new Promise((resolve)=> {
      const loader: TextureLoader = new TextureLoader();

      const defaultOptions: TextreLoaderOptions = {
        wrapS: ClampToEdgeWrapping,
        wrapT: ClampToEdgeWrapping,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        generateMipmaps: false
      };

      if(options !== null) {
        options = Object.assign({}, defaultOptions, options);
      } else {
        options = {...defaultOptions};
      }
      const opt = options as TextreLoaderOptions;

      loader.load(imgSrc, (texture: Texture)=> {
        texture.generateMipmaps = opt.generateMipmaps as boolean;
        texture.wrapS = opt.wrapS as Wrapping;
        texture.wrapT = opt.wrapT as Wrapping;
        texture.minFilter = opt.minFilter as TextureFilter;
        texture.magFilter = opt.magFilter as TextureFilter;
        texture.needsUpdate = true;
        resolve(texture);
      });
    });
  }

  public static getUV( width: number, height: number, textureWidth: number, textureHeight: number) {
    const aspectRatio = width / height;
    const textureAspectRatio = textureWidth / textureHeight;
    const uvSize = new Vector2(1, 1);
    const uvOffset = new Vector2(0, 0);
    let scale = 1;

    if(aspectRatio > textureAspectRatio) {
      scale = width / textureWidth;
      uvSize.y = height / textureHeight / scale;
      uvOffset.y = (1 - uvSize.y) * 0.5;
    } else {
      scale = height / textureHeight;
      uvSize.x = width / textureWidth / scale;
      uvOffset.x = (1 - uvSize.x) * 0.5;
    }

    return { uvSize, uvOffset }
  }

  public static disposeObject3D(
    object: Object3D | Mesh,
    disposeChildren: boolean = true,
    disposeGeometry: boolean = true,
    disposeMaterial: boolean = true,
    removeSelf: boolean = true
  ) {
    if(disposeChildren && object.children && object.children.length > 0) {
      let child: Object3D | Mesh;
      while(child = object.children[0]) {
        this.disposeObject3D(child, disposeGeometry, disposeMaterial, removeSelf);
        object.remove(child);
      }
    }

    if(removeSelf && object.parent) object.parent.remove(object);

    if(!(object instanceof Mesh)) return;

    if(disposeGeometry) object.geometry.dispose();

    if(disposeMaterial && object.material instanceof Material) {
      object.material.dispose();
    }
  }

  public getContainer() {
    return this.container;
  }

  public getCanvas() {
    return this.canvas;
  }

  public getWidth() {
    return this.width;
  }

  public getHeight() {
    return this.height;
  }

  public getScene() {
    return this.scene;
  }

  public async init(): Promise<any> {
    if(!WebGLBase.isWebGLAvailable) throw Error('not support webgl');
    await this.initWebGL();
    this.isInited = true;
  }

  public setPixelRatio(pixelRatio: number, render: boolean = false) {
    if(!this.renderer) return;
    this.pixelRatio = pixelRatio;
    this.renderer.setPixelRatio(this.pixelRatio);
    if(render) this.onResize();
  }

  protected async initWebGL() {
    console.log('init webgl');

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    // renderer
    this.initRenderer();

    // camera
    this.initCamera();

    // scene
    this.scene = new Scene();
    this.scene.matrixAutoUpdate = false;
    this.scene.matrixWorldNeedsUpdate = true;

    this.update = this.update.bind(this);

    await this.initContents();
    console.log('init contents');
  }

  protected async initContents() {}
  public initDatGUI(datGUI: any) {}

  protected initRenderer() {
    this.pixelRatio = window.devicePixelRatio;
    const params: WebGLRendererParameters = {
      // antialias: true,
      alpha: true
    };
    if(this.canvas) params.canvas = this.canvas;
    this.renderer = new WebGL1Renderer(params);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setClearColor(new Color(0, 0, 0), 0);

    if(!this.canvas) {
      this.canvas = this.renderer.domElement;
      this.container.appendChild(this.canvas);
    }
  }

  protected initCamera() {
    this.camera = new PerspectiveCamera(45, 1, 1, 1000000);
    this.camera.position.z = 500;
    this.camera.lookAt(0, 0, 0);
    // this.camera.matrixAutoUpdate = false;
  }

  protected update() {
    this.animationId = requestAnimationFrame(this.update);
    this.render();
  }

  public start() {
    if(!this.isInited) return;
    this.stop();
    this.isRunning = true;
    this.startTimeUpdate();
    this.renderCount = 0;
    this.update();
  }

  public startTimeUpdate() {
    this.startTime = new Date().getTime()
  }

  public stop() {
    if(!this.isInited) return;
    this.isRunning = false;
    if(this.animationId) cancelAnimationFrame(this.animationId);
  }

  public setFrameCountsPerRender(frameCountsPerRender: number) {
    this.frameCountsPerRender = frameCountsPerRender;
  }

  public render(force: boolean = false) {
    if(!this.isInited) return;
    this.time = new Date().getTime() - this.startTime;
    if(!force && this.renderCount++ % this.frameCountsPerRender !== 0) return;
    this.renderCount %= this.frameCountsPerRender;
    this.beforeRenderContents();
    (this.renderer as WebGLRenderer).render(this.scene as Scene, this.camera as Camera);
    this.afterRenderContents();
  }

  protected beforeRenderContents() {}
  protected afterRenderContents() {}

  public onResize(callback: (()=> void) | null = null, width: number = 0, height: number = 0) {
    if(!this.isInited) return;

    this.width = width || this.container.offsetWidth || 1;
    this.height = height || this.container.offsetHeight || 1;

    this.updateCamera();

    (this.renderer as WebGLRenderer).setSize(this.width, this.height);

    this.onResizeContents();
    if(callback) callback();

    this.render(true);
  }

  protected onResizeContents() {
  }

  protected updateCamera() {
    const camera = this.camera as PerspectiveCamera;
    camera.aspect = this.width / this.height;
    const cameraPosZ: number = (this.height / 2) / Math.tan((camera.fov * Math.PI / 180) / 2);
    camera.position.z = cameraPosZ;
    camera.updateMatrix();
    camera.updateProjectionMatrix();
  }

  public dispose() {
    if(this.isDisposed) return;

    this.stop();

    if(this.renderer) {
      this.renderer.clear();
      this.renderer.dispose();

      if(this.renderer.info.programs) {
        for (const program of  this.renderer.info.programs) {
          program.destroy();
        }
      }

      const gl = this.renderer.getContext();
      var numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      for (var unit = 0; unit < numTextureUnits; ++unit) {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      var numAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
      for (var attrib = 0; attrib < numAttributes; ++attrib) {
        gl.vertexAttribPointer(attrib, 1, gl.FLOAT, false, 0, 0);
      }

      gl.canvas.width = 1;
      gl.canvas.height = 1;

      this.renderer.forceContextLoss();
    }

    delete this.scene;
    delete this.camera;
    delete this.renderer;
    this.isDisposed = true;
    this.isInited = false;
  }
}
