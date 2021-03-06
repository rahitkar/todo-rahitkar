class TodoItem {
  constructor(id, content, hasDone = false) {
    this.id = id;
    this.content = content;
    this.hasDone = hasDone;
  }

  toggleStatus() {
    this.hasDone = !this.hasDone;
  }

  editContent(content) {
    if (content === undefined) {
      return false;
    }
    this.content = content;
    return true;
  }
}

class TodoCard {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.tasks = [];
  }

  addItem(taskId, content, hasDone) {
    if (taskId && content !== undefined) {
      this.tasks.push(new TodoItem(taskId, content, hasDone));
      return true;
    }
    return false;
  }

  removeItem(taskId) {
    const itemIndex = this.tasks.findIndex(task => task.id === taskId);
    if (itemIndex !== -1) {
      this.tasks.splice(itemIndex, 1);
      return true;
    }
    return false;
  }

  toggleStatus(taskId) {
    const task = this.getTask(taskId);
    if (task) {
      task.toggleStatus();
      return true;
    }
    return false;
  }

  editTitle(title) {
    if (title === undefined) {
      return false;
    }
    this.title = title;
    return true;
  }

  editTaskContent(taskId, content) {
    const task = this.getTask(+taskId);
    if (task) {
      const istaskEdited = task.editContent(content);
      return istaskEdited;
    }
    return false;
  }

  getTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }
}

class TodoCards {
  constructor() {
    this.todoCards = [];
  }

  static load(todoCards) {
    const todoList = new TodoCards();
    todoCards.forEach(({ id, title, tasks }) => {
      const todoCard = new TodoCard(id, title);
      todoList.todoCards.push(todoCard);
      tasks.forEach(task =>
        todoCard.addItem(task.id, task.content, task.hasDone)
      );
    });
    return todoList;
  }

  addNewTodo(newTodoData) {
    const { id, title } = newTodoData;
    if (id && title) {
      this.todoCards.unshift(new TodoCard(id, title));
      return true;
    }
    return false;
  }

  removeCard(cardId) {
    if (cardId) {
      const targetCardIndex = this.todoCards.findIndex(card => card.id === cardId);
      if (targetCardIndex === -1) {
        return false;
      }
      this.todoCards.splice(targetCardIndex, 1);
      return true;
    }
    return false;
  }

  toggleStatus(cardId, taskId) {
    const card = this.getCard(+cardId);
    if (card) {
      const isToggled = card.toggleStatus(taskId);
      return isToggled;
    }
    return false;
  }

  editTaskContent(cardId, taskId, content) {
    const card = this.getCard(+cardId);
    if (card) {
      const istaskEdited = card.editTaskContent(taskId, content);
      return istaskEdited;
    }
    return false;
  }

  addItem(cardId, taskId, content) {
    const card = this.getCard(cardId);
    if (card) {
      const isItemAdded = card.addItem(taskId, content);
      return isItemAdded;
    }
    return false;
  }

  removeItem(cardId, taskId) {
    const card = this.getCard(cardId);
    if (card) {
      const istaskRemoved = card.removeItem(taskId);
      return istaskRemoved;
    }
    return false;
  }

  editTitle(cardId, title) {
    const card = this.getCard(cardId);
    if (card) {
      const isTitleEdited = card.editTitle(title);
      return isTitleEdited;
    }
    return false;
  }

  getTask(cardId, taskId) {
    const card = this.getCard(cardId);
    if (card) {
      return card.getTask(taskId);
    }
  }

  getCard(cardId) {
    return this.todoCards.find(card => card.id === cardId);
  }

  toJson() {
    return this.todoCards;
  }
}

module.exports = { TodoCards };
