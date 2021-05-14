GPGPU Particle sample
===================================

![GPGPU Particle sample](https://github.com/takumi0125/gpgpuParticleTypes/blob/master/src/assets/img/ogp.png)

## コマンド

具体的な使用方法は<br>
https://github.com/takumi0125/utr-template-v2
を参照してください。

### start (またはdev)
開発時は主にこれを使用 (build + watch)
```
yarn start
```
または
```
yarn dev
```

### build
一通り必要なタスクをすべて実行します。
```
yarn build
```
本番ビルドの場合 (NODE_ENV=production) でかつ `config.minify` の各値がtrueの場合、ファイルが圧縮されます。<br>
納品ファイル作成時はこのコマンドを実行します。
```
yarn build:prd
```

### dist
```
yarn build:prd
```
と同等です。


