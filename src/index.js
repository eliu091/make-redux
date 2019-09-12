/*现在我们把它们集中到一个地方，给这个地方起个名字叫做 store，然后构建一个函数 createStore，
用来专门生产这种 state 和 dispatch 的集合，这样别的 App 也可以用这种模式了*/

// function createStore (state, stateChanger) {
//   const getState = () => state
//   const dispatch = (action) => stateChanger(state, action)
//   return { getState, dispatch }
// }

/*

createStore 接受两个参数，一个是表示应用程序状态的 state；
另外一个是 stateChanger，它来描述应用程序状态会根据 action 发生什么变化，其实就是相当于本节开头的 dispatch 代码里面的内容。

createStore 会返回一个对象，这个对象包含两个方法 getState 和 dispatch。
getState 用于获取 state 数据，其实就是简单地把 state 参数返回。
dispatch 用于修改数据，和以前一样会接受 action，然后它会把 state 和 action 一并传给 stateChanger，
那么 stateChanger 就可以根据 action 来修改 state 了。

*/

//修改上一节的dispatch方法成为stateChanger
// function stateChanger (state, action) {
//   switch (action.type) {
//     case 'UPDATE_TITLE_TEXT':
//       state.title.text = action.text
//       break
//     case 'UPDATE_TITLE_COLOR':
//       state.title.color = action.color
//       break
//     default:
//       break
//   }
// }

/*
针对每个不同的 App，我们可以给 createStore 传入初始的数据 appState，和一个描述数据变化的函数 stateChanger，然后生成一个 store。
需要修改数据的时候通过 store.dispatch，需要获取数据的时候通过 store.getState。
*/

/* 

上面的代码有一个问题，我们每次通过 dispatch 修改数据的时候，其实只是数据发生了变化，
如果我们不手动调用 renderApp，页面上的内容是不会发生变化的。
但是我们总不能每次 dispatch 的时候都手动调用一下 renderApp，
我们肯定希望数据变化的时候程序能够智能一点地自动重新渲染数据，而不是手动调用。

往 dispatch里面加 renderApp 就好了，但是这样 createStore 就不够通用了。
我们希望用一种通用的方式“监听”数据变化，然后重新渲染页面，这里要用到观察者模式。修改 createStore

*/

// function createStore (state, stateChanger) {
//   const listeners = []
//   const subscribe = (listener) => listeners.push(listener)
//   const getState = () => state
//   const dispatch = (action) => {
//     stateChanger(state, action)
//     listeners.forEach((listener) => listener())
//   }
//   return { getState, dispatch, subscribe }
// }

/*

我们在 createStore 里面定义了一个数组 listeners，还有一个新的方法 subscribe，
可以通过 store.subscribe(listener) 的方式给 subscribe 传入一个监听函数，这个函数会被 push 到数组当中。

我们修改了 dispatch，每次当它被调用的时候，除了会调用 stateChanger 进行数据的修改，
还会遍历 listeners 数组里面的函数，然后一个个地去调用。相当于我们可以通过 subscribe 传入数据变化的监听函数，
每当 dispatch 的时候，监听函数就会被调用，这样我们就可以在每当数据变化时候进行重新渲染：

*/

function createStore (state, stateChanger) {
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    stateChanger(state, action)
    listeners.forEach((listener) => listener())
  }
  return { getState, dispatch, subscribe }
}

function renderApp (appState) {
  renderTitle(appState.title)
  renderContent(appState.content)
}

function renderTitle (title) {
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = title.text
  titleDOM.style.color = title.color
}

function renderContent (content) {
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = content.text
  contentDOM.style.color = content.color
}

let appState = {
  title: {
    text: 'This is Title',
    color: 'red',
  },
  content: {
    text: 'This is Content',
    color: 'blue'
  }
}

function stateChanger (state, action) {
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      state.title.text = action.text
      break
    case 'UPDATE_TITLE_COLOR':
      state.title.color = action.color
      break
    default:
      break
  }
}

const store = createStore(appState, stateChanger)
store.subscribe(() => renderApp(store.getState())) // 监听数据变化

renderApp(store.getState()) // 首次渲染页面
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《Updated Title》' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色