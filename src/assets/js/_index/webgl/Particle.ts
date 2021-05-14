import { Points                 } from 'three/src/objects/Points'              ;
import { Object3D               } from 'three/src/core/Object3D'               ;
import { BufferGeometry         } from 'three/src/core/BufferGeometry'         ;
import { RawShaderMaterial      } from 'three/src/materials/RawShaderMaterial' ;
import { WebGL1Renderer         } from 'three/src/renderers/WebGL1Renderer'    ;
import { DataTexture            } from 'three/src/textures/DataTexture'        ;
import { Vector2                } from 'three/src/math/Vector2'                ;
import { Float32BufferAttribute } from 'three/src/core/BufferAttribute'        ;
import { WebGLRenderTarget      } from 'three/src/renderers/WebGLRenderTarget' ;
import { Texture                } from 'three/src/textures/Texture'            ;
import { Color                  } from 'three/src/math/Color'                  ;

import { HalfFloatType, LinearFilter, NearestFilter } from 'three/src/constants';

// ↑だとtree shakingされないので、独自に定義し直したものを使用する
// import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer' ;
import { GPUComputationRenderer, Variable } from './GPUComputationRenderer';

import gsap, { Expo } from 'gsap';
import WebFont from "webfontloader";

const DATA_TEXTURE_SIZE = 100;  // DataTextureの一辺のサイズ
const NUM_PARTICLES = DATA_TEXTURE_SIZE * DATA_TEXTURE_SIZE; // パーティクルの数
const IMG_CANVAS_SIZE = 512;  // 画像のピクセル情報を取得する際に使用するcanvasの一辺のサイズ
const POINT_SIZE_BASIS = 30;  // IMG_CANVAS_SIZEを基準にしたポイントのサイズ
const POINTER_RADIUS_BASIS = 160;  // IMG_CANVAS_SIZEを基準にしたポインターの半径
const TYPE_POINT_TEXTURE_UNIT = 64;  // ポイントクラウド用のテクスチャの一文字のサイズ

// Google Fonts List
const FONTS = [
  { family: 'Lobster'              , color: new Color('#2CE54F') },
  { family: 'Zilla Slab'           , color: new Color('#2D6DA4') },
  { family: 'EB Garamond'          , color: new Color('#D2CDD1') },
  { family: 'Black Ops One'        , color: new Color('#2E4972') },
  { family: 'Righteous'            , color: new Color('#D2DC0C') },
  { family: 'Fredericka the Great' , color: new Color('#A1759D') },
  { family: 'Jost'                 , color: new Color('#3D8724') },
  { family: 'Bubblegum Sans'       , color: new Color('#6796EC') },
  { family: 'Bangers'              , color: new Color('#8C9280') },
  { family: 'Press Start 2P'       , color: new Color('#400EE1') },
  { family: 'Ultra'                , color: new Color('#D55BA1') },
  { family: 'Codystar'             , color: new Color('#B92105') },
  { family: 'Cookie'               , color: new Color('#AC6AF1') },
  { family: 'Vidaloka'             , color: new Color('#FC953A') },
  { family: 'Wallpoet'             , color: new Color('#79828E') },
  { family: 'Aclonica'             , color: new Color('#5864D6') }
];

export default class WebGLMesh extends Object3D {
  protected renderer!: WebGL1Renderer;
  protected points!: Points;
  protected geometry!: BufferGeometry;
  protected material!: RawShaderMaterial;
  protected pointTexture!: Texture;
  protected typeIndex: number = 0;
  protected numTypes: number = 0;

  // IMG_CANVAS_SIZEを基準に、描画時にどれくらい拡大させるか
  protected drawScale: number = 1;

  // GPGPU関連
  protected gpuComputeRenderer!: GPUComputationRenderer;
  protected positionVelocityVariable!: Variable; // パーティクルの位置情報を保存するVariable
  protected colorVariable!: Variable;    // パーティクルの色情報のVariable

  // 画像のピクセル情報を格納する DataTextureの配列
  protected imgPositionsData: DataTexture[] = [];  // 色があるピクセルの位置を格納
  protected imgColorsData: DataTexture[] = [];     // 色を格納

  constructor(renderer: WebGL1Renderer) {
    super();
    this.renderer = renderer;
    this.matrixAutoUpdate = false;
    this.numTypes = FONTS.length;
  }

  public async init() {
    await this.initWebFonts();
    this.initPointTexture();
    await this.initComputeRenderer();
    this.initGeometry();
    this.initMaterial();

    this.points = new Points(this.geometry, this.material);
    this.points.matrixAutoUpdate = false;
    this.add(this.points);
    this.updateMatrix();
  }

  protected async initWebFonts(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("loading fonts...");
      WebFont.load({
        google: {
          families: FONTS.map((fontData)=> fontData.family),
          text: 'A'
        },

        timeout: 10000,

        fontactive: (familyName) => {
          console.log("fontactive", familyName);
        },

        fontinactive: (familyName) => {
          console.error("fontinactive", familyName);
        },

        active: () => {
          console.log("all fonts loaded");
          resolve(true);
        },

        inactive: () => {
          console.error("font inactive");
          resolve("load fonts error");
        }
      });
    });
  }

  protected initPointTexture() {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = TYPE_POINT_TEXTURE_UNIT * this.numTypes;
    canvas.height = TYPE_POINT_TEXTURE_UNIT;
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if(!context) return;

    for (let i = 0; i < this.numTypes; i++) {
      this.drawType(
        context,
        TYPE_POINT_TEXTURE_UNIT * 0.9,
        FONTS[i].family,
        new Color('#ffffff'),
        TYPE_POINT_TEXTURE_UNIT * i + TYPE_POINT_TEXTURE_UNIT * 0.5,
        TYPE_POINT_TEXTURE_UNIT * 0.5
      )
    }
    this.pointTexture = new Texture(canvas);
    this.pointTexture.minFilter = LinearFilter;
    this.pointTexture.magFilter = LinearFilter;
    this.pointTexture.generateMipmaps = false;
    this.pointTexture.needsUpdate = true;
  }

  protected async initComputeRenderer() {
    this.gpuComputeRenderer = new GPUComputationRenderer(DATA_TEXTURE_SIZE, DATA_TEXTURE_SIZE, this.renderer);
    this.gpuComputeRenderer.setDataType(HalfFloatType)

    for (let i = 0; i < this.numTypes; i++) {
      const imgPositionsData = this.gpuComputeRenderer.createTexture();
      imgPositionsData.minFilter = NearestFilter;
      imgPositionsData.magFilter = NearestFilter;
      this.imgPositionsData.push(imgPositionsData);

      const imgColorsData = this.gpuComputeRenderer.createTexture();
      imgColorsData.minFilter = NearestFilter;
      imgColorsData.magFilter = NearestFilter;
      this.imgColorsData.push(imgColorsData);
    }

    await this.initTypesData()

    this.positionVelocityVariable = this.gpuComputeRenderer.addVariable(
      'positionVelocityTexture',
      require('./glsl/computePosition.frag').default,
      this.imgPositionsData[this.typeIndex]
    );
    this.positionVelocityVariable.material.uniforms.pointerPos = { value: new Vector2() };
    this.positionVelocityVariable.material.uniforms.pointerForceRadius = { value: 0 };
    this.positionVelocityVariable.material.uniforms.isPointerActive = { value: 0 };
    this.positionVelocityVariable.material.uniforms.transitionValue = { value: 0 };
    this.positionVelocityVariable.material.uniforms.imgPositionsData = { value: this.imgPositionsData[this.typeIndex] };

    this.colorVariable = this.gpuComputeRenderer.addVariable(
      'colorTexture',
      require('./glsl/computeColor.frag').default,
      this.imgColorsData[this.typeIndex]
    );
    this.colorVariable.material.uniforms.imgColorsData = { value: this.imgColorsData[this.typeIndex] };

    this.gpuComputeRenderer.setVariableDependencies(this.positionVelocityVariable, [ this.positionVelocityVariable ]);
    this.gpuComputeRenderer.setVariableDependencies(this.colorVariable, [ this.colorVariable, this.positionVelocityVariable ]);

    this.gpuComputeRenderer.init();
  }

  protected initMaterial() {
    this.material  = new RawShaderMaterial({
      vertexShader: require('./glsl/particle.vert').default,
      fragmentShader: require('./glsl/particle.frag').default,
      depthWrite: false,
      depthTest: false,
      transparent: true,
      uniforms: {
        pointTexture: { value: this.pointTexture },
        positionVelocityTexture: { value: null },
        colorTexture: { value: null },
        dataTextureSize: { value: DATA_TEXTURE_SIZE },
        dataCanvasSize: { value: IMG_CANVAS_SIZE },
        pointSize: { value: 1 },
        drawScale: { value: 1 },
        time: { value: 0 },
        typeIndex: { value: 0 },
        numTypes: { value: this.numTypes },
      }
    })
  }

  protected initGeometry() {
    this.geometry = new BufferGeometry();
    const positions: number[] = [];
    const vertexIndices: number[] = [];
    const randomValues: number[] = [];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      positions.push(0, 0, 0);
      vertexIndices.push(i);
      randomValues.push(
        this.getRandomValue(),
        this.getRandomValue(),
        this.getRandomValue(),
        this.getRandomValue()
      )
    }

    this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('vertexIndex', new Float32BufferAttribute(vertexIndices, 1));
    this.geometry.setAttribute('randomValue', new Float32BufferAttribute(randomValues, 4));
  }

  protected getRandomValue() {
    return (Math.random() + Math.random() + Math.random()) / 3;
  }

  protected async initTypesData() {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = IMG_CANVAS_SIZE;
    canvas.height = IMG_CANVAS_SIZE;
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if(!context) return;

    for (let i = 0; i < this.numTypes; i++) {
      this.createTypeImgData(i, context);
    }
  }

  // canvasの指定の矩形に文字(A)を描画
  protected drawType(
    context: CanvasRenderingContext2D,
    fontSize: number,
    fontFamily: string,
    color: Color,
    offsetX: number,
    offsetY: number,
  ) {
    context.font = `${fontSize}px '${fontFamily}'`;
    context.fillStyle = `#${color.getHexString()}`;
    context.textBaseline = "middle";
    context.textAlign = 'center';
    context.fillText("A", offsetX, offsetY);
  }

  // 文字の画像ピクセル情報を生成(内部でcreateImgDataFromCanvasをコール)
  protected createTypeImgData(
    index: number,
    context: CanvasRenderingContext2D,
  ) {
    // 文字を描画
    this.drawType(
      context,
      IMG_CANVAS_SIZE * 0.9,
      FONTS[index].family,
      FONTS[index].color,
      IMG_CANVAS_SIZE * 0.5,
      IMG_CANVAS_SIZE * 0.5
    )
    this.createImgDataFromCanvas(index, context);
  }

  // canvasから画像のピクセル情報を生成
  protected async createImgDataFromCanvas(
    index: number,
    context: CanvasRenderingContext2D,
  ) {
    const canvasImgData = context.getImageData(0, 0, IMG_CANVAS_SIZE, IMG_CANVAS_SIZE);

    // 色がある alpha !== 0ピクセルの位置、色を保存
    let indices: number[] = [];
    const positions: number[][] = [];
    const colors: number[][] = [];
    const numPixels = canvasImgData.data.length / 4;
    for (let i = 0; i < numPixels; i++) {
      const index = i * 4;
      const r = canvasImgData.data[index + 0];
      const g = canvasImgData.data[index + 1];
      const b = canvasImgData.data[index + 2];
      const a = canvasImgData.data[index + 3];
      const colIndex = i % IMG_CANVAS_SIZE;
      const rowIndex = Math.floor(i / IMG_CANVAS_SIZE);
      if(a !== 0) {
        // 3Dの座標系に変換 (中心が0, x座標は左、y座標は上方向が正)
        indices.push(positions.length);
        positions.push([
          colIndex - IMG_CANVAS_SIZE * 0.5,
          -(rowIndex - IMG_CANVAS_SIZE * 0.5)
        ]);
        colors.push([ r, g, b, a ]);
      }
    }
    context.clearRect(0, 0, IMG_CANVAS_SIZE, IMG_CANVAS_SIZE);

    // インデックスをシャッフル
    indices = this.shuffleArray(indices);

    // DataTextureに値を入れる
    const positionsImgData = this.imgPositionsData[index].image.data;
    const colorsImgData = this.imgColorsData[index].image.data;
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const j = i % indices.length;  // NUM_PARTICLESよりも色がついているピクセルが少ない場合は重複させる
      const k = indices[j];
      const position: number[] | undefined = positions[k];
      const color: number[] | undefined = colors[k];
      const index4 = j * 4;

      positionsImgData[index4 + 0] = position[0];
      positionsImgData[index4 + 1] = position[1];
      positionsImgData[index4 + 2] = 0;
      positionsImgData[index4 + 3] = 0;
      colorsImgData[index4 + 0] = color[0];
      colorsImgData[index4 + 1] = color[1];
      colorsImgData[index4 + 2] = color[2];
      colorsImgData[index4 + 3] = color[3];
    }
  }

  protected shuffleArray(arr: any[]) {
    const _arr = arr.slice();
    for(var i = _arr.length - 1; i > 0; i--){
      var r = Math.floor(Math.random() * (i + 1));
      var tmp = _arr[i];
      _arr[i] = _arr[r];
      _arr[r] = tmp;
    }
    return _arr;
  }

  public onResize() {
    // drawScaleは画面サイズの短辺を基準
    const drawAreaSize = Math.min(window.innerWidth, window.innerHeight);
    this.drawScale = drawAreaSize / IMG_CANVAS_SIZE;
    this.material.uniforms.drawScale.value = this.drawScale;
    this.material.uniforms.pointSize.value = POINT_SIZE_BASIS / IMG_CANVAS_SIZE * drawAreaSize;
    this.positionVelocityVariable.material.uniforms.pointerForceRadius.value = POINTER_RADIUS_BASIS / IMG_CANVAS_SIZE * drawAreaSize;
  }

  public onPointerMove(posX: number, posY: number) {
    // ブラウザ座標からIMG_CANVAS_SIZE基準の座標に変換
    const x = (posX - window.innerWidth * 0.5) / this.drawScale;
    const y = -(posY - window.innerHeight * 0.5) / this.drawScale;

    // ポインターの位置をアニメーションさせる
    gsap.to(
      this.positionVelocityVariable.material.uniforms.pointerPos.value,
      {
        x,
        y,
        duration: 0.4,
        ease: Expo.easeOut,
        overwrite: true,
      }
    )

    // ポインタの影響を有効化
    this.activatePointer();
  }

  public activatePointer() {
    if(this.positionVelocityVariable.material.uniforms.isPointerActive.value !== 0) return;
    gsap.to(this.positionVelocityVariable.material.uniforms.isPointerActive, 0.4, { value: 1, ease: Expo.easeOut });
  }

  public update(time: number = 0) {
    this.material.uniforms.time.value = time;
    this.gpuComputeRenderer.compute();
    this.positionVelocityVariable.material.uniforms.transitionValue.value = 0;
    this.material.uniforms.positionVelocityTexture.value = (this.gpuComputeRenderer.getCurrentRenderTarget(this.positionVelocityVariable) as WebGLRenderTarget).texture;
    this.material.uniforms.colorTexture.value = (this.gpuComputeRenderer.getCurrentRenderTarget(this.colorVariable) as WebGLRenderTarget).texture;
  }

  public changeType() {
    this.typeIndex = (this.typeIndex + 1) % this.numTypes;
    this.material.uniforms.typeIndex.value = this.typeIndex;
    this.positionVelocityVariable.material.uniforms.transitionValue.value = 1;
    this.positionVelocityVariable.material.uniforms.imgPositionsData.value = this.imgPositionsData[this.typeIndex];
    this.colorVariable.material.uniforms.imgColorsData.value = this.imgColorsData[this.typeIndex];
  }
}
