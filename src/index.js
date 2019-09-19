/* 
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

其实我们之前的例子当中是有比较严重的性能问题的。
每当更新数据就重新渲染整个 App，但其实我们两次更新都没有动到 appState 里面的 content 字段的对象，而动的是 title 字段。
其实并不需要重新 renderContent，它是一个多余的更新操作，现在我们需要优化它。

*/

/* 
这里提出的解决方案是，在每个渲染函数执行渲染操作之前先做个判断，判断传入的新数据和旧的数据是不是相同，相同的话就不渲染了。
然后我们用一个 oldState 变量保存旧的应用状态，在需要重新渲染的时候把新旧数据传进入去：
*/
// function renderApp (newAppState, oldAppState = {}) { // 防止 oldAppState 没有传入，所以加了默认参数 oldAppState = {}
//   if (newAppState === oldAppState) return // 数据没有变化就不渲染了
//   console.log('render app...')
//   renderTitle(newAppState.title, oldAppState.title)
//   renderContent(newAppState.content, oldAppState.content)
// }

// function renderTitle (newTitle, oldTitle = {}) {
//   if (newTitle === oldTitle) return // 数据没有变化就不渲染了
//   console.log('render title...')
//   const titleDOM = document.getElementById('title')
//   titleDOM.innerHTML = newTitle.text
//   titleDOM.style.color = newTitle.color
// }

// function renderContent (newContent, oldContent = {}) {
//   if (newContent === oldContent) return // 数据没有变化就不渲染了
//   console.log('render content...')
//   const contentDOM = document.getElementById('content')
//   contentDOM.innerHTML = newContent.text
//   contentDOM.style.color = newContent.color
// }

// const store = createStore(appState, stateChanger)
// let oldState = store.getState() // 缓存旧的 state
// store.subscribe(() => {
//   const newState = store.getState() // 数据可能变化，获取新的 state
//   renderApp(newState, oldState) // 把新旧的 state 传进去渲染
//   oldState = newState // 渲染完以后，新的 newState 变成了旧的 oldState，等待下一次数据变化重新渲染
// })

// 但是上面的代码根本不会达到我们的效果。看看我们的 stateChanger：

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

即使你修改了 state.title.text，但是 state 还是原来那个 state，
state.title 还是原来的 state.title，这些引用指向的还是原来的对象，
只是对象内的内容发生了改变。 */


/*
共享结构的对象 (ES6 的语法)

const obj = { a: 1, b: 2}
const obj2 = { ...obj } // => { a: 1, b: 2 }
const obj2 = { ...obj }
其实就是新建一个对象 obj2，然后把 obj 所有的属性都复制到 obj2 里面，相当于对象的浅复制。上
面的 obj 里面的内容和 obj2 是完全一样的，但是却是两个不同的对象。除了浅复制对象，还可以覆盖、拓展对象属性：

const obj = { a: 1, b: 2}
const obj2 = { ...obj, b: 3, c: 4} // => { a: 1, b: 3, c: 4 }，覆盖了 b，新增了 c
我们可以把这种特性应用在 state 的更新上，我们禁止直接修改原来的对象，
一旦你要修改某些东西，你就得把修改路径上的所有对象复制一遍，例如，我们不写下面的修改代码：
*/


// let newAppState = { // 新建一个 newAppState
//   ...appState, // 复制 appState 里面的内容
//   title: { // 用一个新的对象覆盖原来的 title 属性
//     ...appState.title, // 复制原来 title 对象里面的内容
//     text: 'Updated Title' // 覆盖 text 属性
//   }
// }

/* appState 和 newAppState 其实是两个不同的对象，因为对象浅复制的缘故，其实它们里面的属性 content 指向的是同一个对象；
但是因为 title 被一个新的对象覆盖了，所以它们的 title 属性指向的对象是不同的。同样地，修改 appState.title.color： */


function createStore (state, stateChanger) {
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = stateChanger(state, action) // 覆盖原对象
    listeners.forEach((listener) => listener())
  }
  return { getState, dispatch, subscribe }
}

function renderApp (newAppState, oldAppState = {}) { // 防止 oldAppState 没有传入，所以加了默认参数 oldAppState = {}
  if (newAppState === oldAppState) return // 数据没有变化就不渲染了
  console.log('render app...')
  renderTitle(newAppState.title, oldAppState.title)
  renderContent(newAppState.content, oldAppState.content)
}

function renderTitle (newTitle, oldTitle = {}) {
  if (newTitle === oldTitle) return // 数据没有变化就不渲染了
  console.log('render title...')
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = newTitle.text
  titleDOM.style.color = newTitle.color
}

function renderContent (newContent, oldContent = {}) {
  if (newContent === oldContent) return // 数据没有变化就不渲染了
  console.log('render content...')
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = newContent.text
  contentDOM.style.color = newContent.color
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
      return { // 构建新的对象并且返回
        ...state,
        title: {
          ...state.title,
          text: action.text
        }
      }
    case 'UPDATE_TITLE_COLOR':
      return { // 构建新的对象并且返回
        ...state,
        title: {
          ...state.title,
          color: action.color
        }
      }
    default:
      return state // 没有修改，返回原来的对象
  }
}

const store = createStore(appState, stateChanger)
let oldState = store.getState() // 缓存旧的 state
store.subscribe(() => {
  const newState = store.getState() // 数据可能变化，获取新的 state
  renderApp(newState, oldState) // 把新旧的 state 传进去渲染
  oldState = newState // 渲染完以后，新的 newState 变成了旧的 oldState，等待下一次数据变化重新渲染
})

renderApp(store.getState()) // 首次渲染页面
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: 'Updated Title' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色