##移动端 手势 sgesture
这是一个针对 `web mobile` 的手势扩展

PS1: 还木有测试 （逃

PS2: 后期考虑添加 `react vue` 组件

###Usage

```javascript
// es6
import sgesture from './sgesture.js';
const ele = document.querySlector('target element');
// e: TouchEvent
const option = {
  touchStart: (e) => {...},
  touchMove: (e) => {...},
  touchEnd: (e) => {...},
  touchCancel: (e) => {...},
  pinch: (e) => {...},
  rotate: (e) => {...},
  pressMove: (e) => {...},
  tap: (e) => {...},
  longTap: (e) => {...},
  doubleTap: (e) => {...},
};
// 初始化
const ges = sgesture(ele, option);
// 更改方法
// 以 tap 为例
ges.on('tap', (e) => {...});
```
> ####TouchEvent

触发相应事件后会将 `TouchEvent` 传入方法

* `touches` TouchList对象
* `target` 最初触发元素
* `...`
* `rotation` 旋转的角度 // 仅针对 rotate 事件
* `scale` 缩放比例 // 仅针对 pinch 事件

###事件流程
> ####touchstart

```bash
false isChangedTouches? true touchStart()
|                       |
|                       longTap()
|                       |
| --------------------> End
```

> ####touchmove

```bash
false isChangedTouches? true touchMove()
                        |
                        cancellongTap()
                        |
                        isPinch? true pinch()
                        |
                        isRotate? true rotate()
                        |
                        End
```
> ####touchend

```bash
false isChangedTouches? true touchEnd() 
|                       |
|                       cancellongTap()
|                       |                        
|                 false isSwipe? true swipe() -> End
|                 |   
|           false isDoubletap? true cancelTap() doubleTap() -> End
|           |
End <- false isTap? true tap() -> End                          
```
> ####touchcancel

```bash
cancellongTap()
```

### 事件对象 

> ####TouchList [link](https://developer.mozilla.org/en-US/docs/Web/API/TouchList)

`TouchList` 代表一个触摸平面上所有触点 (`touch`) 的列表  

```javascript
// example: get TouchList
target.addEventListener("touchstart", (e) => {
  const touches = e.touches;
}, false);
```

> ###Touch [link](https://developer.mozilla.org/en-US/docs/Web/API/Touch)

`Touch` 对象表示在触控设备上的触摸点

```javascript
// example: get Touch
target.addEventListener("touchstart", (e) => {
  const touches = e.touches;
  const touch = touches[0];
}, false);
```
`Touch` 属性

* identifier         唯一标识符
* screenX / screenY  相对屏幕坐标
* clientX / clientY  相对可见区域坐标
* pageX / pageY      相对HTML坐标
* radiusX / radiusY  接触面最小椭圆半径
* rotationAngle      旋转角
