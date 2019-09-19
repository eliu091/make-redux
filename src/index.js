/* 

我们开始学习 Redux，一种新型的前端“架构模式”。经常和 React.js 一并提出，
你要用 React.js 基本都要伴随着 Redux 和 React.js 结合的库 React-redux。

要注意的是，Redux 和 React-redux 并不是同一个东西。
Redux 是一种架构模式（Flux 架构的一种变种），它不关注你到底用什么库，你可以把它应用到 React 和 Vue，甚至跟 jQuery 结合都没有问题。
而 React-redux 就是把 Redux 这种架构模式和 React.js 结合起来的一个库，就是 Redux 架构在 React.js 中的体现。

为了让大家对问题的根源有所了解，了解这些工具到底解决什么问题，怎么解决的。

现在让我们忘掉 React.js、Redux 这些词，从一个例子的代码 + 问题开始推演。

*/

const appState = {
  title: {
    text: 'Test Titile',
    color: 'red',
  },
  content: {
    text: 'Test Content',
    color: 'blue'
  }
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

  renderApp(appState)


/* 

这是一个很简单的 App，但是它存在一个重大的隐患，我们渲染数据的时候，使用的是一个共享状态 appState，
每个人都可以修改它。如果我在渲染之前做了一系列其他操作：

loadDataFromServer()
doSomethingUnexpected()
doSomthingMore()
// ...
renderApp(appState)

renderApp(appState) 之前执行了一大堆函数操作，你根本不知道它们会对 appState 做什么事情，renderApp(appState) 的结果根本没法得到保障。
一个可以被不同模块任意修改共享的数据状态就是不安全的，一旦数据可以任意修改，
所有对共享状态的操作都是不可预料的（某个模块 appState.title = null），出现问题的时候 debug 起来就非常困难，所以要尽量避免全局变量。

但不同的模块（组件）之间确实需要共享数据，这些模块（组件）还可能需要修改这些共享数据，
这里的矛盾就是：“模块（组件）之间需要共享数据”，和“数据可能被任意修改导致不可预料的结果”之间的矛盾。

我们可以学习 React.js 团队的做法，把事情搞复杂一些，提高数据修改的门槛：模块（组件）之间可以共享数据，也可以改数据。
但是我们约定，这个数据并不能直接改，你只能执行某些我允许的某些修改，而且你修改的必须大张旗鼓地告诉我。

我们定义一个函数，叫 dispatch，它专门负责数据的修改：


*/

// function dispatch (action) {
//   switch (action.type) {
//     case 'UPDATE_TITLE_TEXT':
//       appState.title.text = action.text
//       break
//     case 'UPDATE_TITLE_COLOR':
//       appState.title.color = action.color
//       break
//     default:
//       break
//   }
// }

/* 

所有对数据的操作必须通过 dispatch 函数。它接受一个参数 action，
这个 action 是一个普通的 JavaScript 对象，里面必须包含一个 type 字段来声明你到底想干什么
。dispatch 在 swtich 里面会识别这个 type 字段，能够识别出来的操作才会执行对 appState 的修改。

上面的 dispatch 它只能识别两种操作，一种是 UPDATE_TITLE_TEXT 它会用 action 的 text 字段去更新 appState.title.text；一
种是 UPDATE_TITLE_COLOR，它会用 action 的 color 字段去更新 appState.title.color。
可以看到，action 里面除了 type 字段是必须的以外，其他字段都是可以自定义的。

任何的模块如果想要修改 appState.title.text，必须大张旗鼓地调用 dispatch：

*/

// dispatch({ type: 'UPDATE_TITLE_TEXT', text: 'Updated Text' }) // 修改标题文本
// dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'Red' }) // 修改标题颜色


/*

我们不需要担心 renderApp(appState) 之前的那堆函数操作会干什么奇奇怪怪得事情，因为我们规定不能直接修改 appState，
它们对 appState 的修改必须只能通过 dispatch。而我们看看 dispatch 的实现可以知道，你只能修改 title.text 和 title.color。

如果某个函数修改了 title.text 但是我并不想要它这么干，我需要 debug 出来是哪个函数修改了，
我只需要在 dispatch的 switch 的第一个 case 内部打个断点就可以调试出来了。

*/


// let appState = {
//   title: {
//     text: 'React.js 小书',
//     color: 'red',
//   },
//   content: {
//     text: 'React.js 小书内容',
//     color: 'blue'
//   }
// }

// function dispatch (action) {
//   switch (action.type) {
//     case 'UPDATE_TITLE_TEXT':
//       appState.title.text = action.text
//       break
//     case 'UPDATE_TITLE_COLOR':
//       appState.title.color = action.color
//       break
//     default:
//       break
//   }
// }

// function renderApp (appState) {
//   renderTitle(appState.title)
//   renderContent(appState.content)
// }

// function renderTitle (title) {
//   const titleDOM = document.getElementById('title')
//   titleDOM.innerHTML = title.text
//   titleDOM.style.color = title.color
// }

// function renderContent (content) {
//   const contentDOM = document.getElementById('content')
//   contentDOM.innerHTML = content.text
//   contentDOM.style.color = content.color
// }

// renderApp(appState) // 首次渲染页面
// dispatch({ type: 'UPDATE_TITLE_TEXT', text: 'Updated Title' }) // 修改标题文本
// dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
// renderApp(appState) // 把新的数据渲染到页面上