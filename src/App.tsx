import { useMemo } from 'react';
import { atom } from 'signia'
import { useAtom } from 'signia-react'
import './App.css'
import { ChakraProvider, Button, Heading, InputGroup, Input, InputRightElement } from '@chakra-ui/react'


class Todo {
  metadata = atom('metadata', {
    title: 'Groceries',
  })

  readonly todoItems = new TodoItems(this)

  setTitle(title: string) {
    this.metadata.update((metadata) => ({ ...metadata, title }))
  }
}

class TodoItems {
  constructor(private todo: Todo) { }

  items = atom('items', {
    1: {
      id: 1,
      text: 'Milk',
      completed: false,
    }
  })

  addItem(todoText: string) {
    const listItem = {
      id: Date.now(),
      text: todoText,
      completed: false,
    }
    this.items.update((items) => ({ ...items, [listItem.id]: listItem }))
  }

  markItemAsDone(itemId) {
    const updatedItem = { ...this.items.value[itemId], completed: true }
    this.items.update((items) => ({ ...items, itemId: updatedItem }))
  }
}

const useNewTodo = () => useMemo(() => new Todo(), [])

function App() {
  const todo = useNewTodo()
  const todoText = useAtom('todoText', '');

  const onTodoItemChange = (e) => {
    console.log('e.target.value: ', e.target.value);
    todoText.set(e.target.value);
  }

  const onAddClick = (e) => {
    console.log('text being added ', todoText.value);
    todo.todoItems.addItem(todoText.value);
  }

  console.log('todo: ', todo.todoItems.items.value)
  return (
    <ChakraProvider>
      <div className="App">
        <Heading>{todo.metadata.value.title}</Heading>
        <InputGroup size='md' mt='2rem'>
          <Input
            pr='4.5rem'
            type={'text'}
            onChange={onTodoItemChange}
            placeholder='Enter item to add'
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={onAddClick}>
              Add
            </Button>
          </InputRightElement>
        </InputGroup>
      </div>
    </ChakraProvider>
  )
}

export default App
