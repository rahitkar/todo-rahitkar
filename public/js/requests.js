const okStatusCode = 200;
const makeItemHtml = (cardId, item) => {
  const { id, content, hasDone } = item;
  let checked = '';
  if (hasDone) {
    checked = 'checked';
  }
  return `
    <div class="todoItem" id="id${id}" onmouseover="show('cross${id}')" onmouseout="hide('cross${id}')">
     <input type="checkbox" onclick="toggleStatus('${cardId}', '${id}')" ${checked}/> 
     &nbsp <input class="${checked} itemContent" value="${content}" class="" onchange="editItem('${cardId}', '${id}')"/>
     <img id="cross${id}" class="hide" onclick="deleteItem('${cardId}', '${id}')" src="img/trash-can.svg"/>
     </div> `;
};

const toHtml = (cardId, title, items) => {
  const html =
    `
    <div class="todoHeader">
      <input value="${title}" class="todoTitle";" onchange="editTitle('${cardId}')"/>
        <img onclick= removeTodo("${cardId}") class="crossButton" src="img/trash.svg"/>
    </div>` +
    `<div style="justify-content:flex-start; margin-top:10px;">
      <div id="todoss-${cardId}" class="todoArea">` +
    items
      .map(item => {
        return (
          `<div class="todoItem" id="${item.id}">` +
          makeItemHtml(cardId, item) +
          '</div>'
        );
      })
      .join('') +
    `</div>
    <input id="textArea" type="text" class="textArea" name="comments" placeholder=" add todo item ..."/>
    <button class="button"onclick="addTodoItem('${cardId}', '${title}')">+</button>
  </div>`;

  return html;
};

const requestHttp = (method, url, data, callBack) => {
  const req = new XMLHttpRequest();
  req.onload = function () {
    if (this.status === okStatusCode) {
      const contentType = this.getResponseHeader('content-type');
      if (contentType === 'application/json') {
        callBack(JSON.parse(this.responseText));
        return;
      }
      document.open();
      document.write(this.responseText);
      document.close();
    }
  };
  req.open(method, url, true);
  if (method === 'POST') {
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  }
  req.send(data);
};

const fetchAllTodoCards = () => {
  requestHttp('GET', '/allTodo', null, text => {
    const todoList = document.querySelector('#todoList');

    const allTodoCards = text;
    todoList.innerHTML = allTodoCards
      .map(todoCard => {
        return `<div class="card" id="${todoCard.id}">${toHtml(
          todoCard.id,
          todoCard.title,
          todoCard.tasks
        )}</div>`;
      })
      .join('');
  });
};

const makeTodoCard = () => {
  const title = document.querySelector('#addTodoTitle');
  const todoTitle = title.value || 'Title';
  const newTodoData = JSON.stringify({ title: todoTitle });

  title.value = '';

  requestHttp('POST', '/newTodoCard', newTodoData, text => {
    const todoList = document.querySelector('#todoList');
    const newTodo = document.createElement('div');
    const resText = text;

    newTodo.className = 'card';
    newTodo.setAttribute('id', resText.id);
    newTodo.innerHTML = toHtml(resText.id, resText.title, []);
    todoList.prepend(newTodo);
  });
};

const removeTodo = cardId => {
  const list = document.querySelector('#todoList');
  const card = document.getElementById(cardId);
  requestHttp('POST', '/removeTodo', JSON.stringify({ cardId }), () => {
    list.removeChild(card);
  });
};

const addTodoItem = cardId => {
  const card = document.getElementById(`${cardId}`);
  const textArea = card.querySelector('#textArea');
  const content = textArea.value;
  textArea.value = '';
  if (!content) {
    return;
  }
  requestHttp(
    'POST',
    '/addItem',
    JSON.stringify({ id: cardId, content }),
    text => {
      const card = document.getElementById(`todoss-${cardId}`);
      const resText = text;
      const item = document.createElement('div');
      item.className = 'todoItem';
      item.id = `${resText.id}`;
      item.innerHTML = makeItemHtml(cardId, resText);
      card.appendChild(item);
    }
  );
};

const deleteItem = (cardId, taskId) => {
  requestHttp(
    'POST',
    '/removeTodoItem',
    JSON.stringify({ cardId, taskId }),
    () => {
      const todoList = document.querySelector(`#todoss-${cardId}`);
      const itemToDelete = document.getElementById(taskId);
      todoList.removeChild(itemToDelete);
    }
  );
};

const toggleStatus = (cardId, taskId) => {
  const task = document.getElementById(`id${taskId}`);
  const item = task.querySelector('.itemContent');
  requestHttp(
    'POST',
    '/toggleHasDoneStatus',
    JSON.stringify({ cardId, taskId }),
    () => { }
  );
  if (item.classList.contains('checked')) {
    item.classList.remove('checked');
    return;
  }
  item.classList.add('checked');
};

const editTitle = cardId => {
  const title = event.target.value;

  requestHttp(
    'POST',
    '/editTitle',
    JSON.stringify({ cardId, title }),
    () => { }
  );
};

const editItem = (cardId, taskId) => {
  const content = event.target.value;

  requestHttp(
    'POST',
    '/editTaskContent',
    JSON.stringify({ cardId, taskId, content }),
    () => { }
  );
};


const logOut = () => {
  requestHttp(
    'GET',
    '/logout',
    null,
    () => { }
  );
}
