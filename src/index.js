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
