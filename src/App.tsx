import { useMemo } from 'react';
import { atom } from 'signia'
import { useAtom } from 'signia-react'
import './App.css'
import { ChakraProvider, Text, Button, Heading, Checkbox, InputGroup, Input, InputRightElement, List, ListItem, ListIcon } from '@chakra-ui/react'
import { MdCheckCircle } from 'react-icons/md'

class Todo {
  metadata = atom('metadata', {
    title: 'Groceries',
  })

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
    this.items.update((items) => ({ ...items, [itemId]: updatedItem }))
  }

  setTitle(title: string) {
    this.metadata.update((metadata) => ({ ...metadata, title }))
  }
}

const useNewTodo = () => useMemo(() => new Todo(), [])

function App() {
  const todo = useNewTodo()
  const todoText = useAtom('todoText', '');

  const onTodoItemChange = (e) => {
    todoText.set(e.target.value);
  }

  const onAddClick = (e) => {
    todo.addItem(todoText.value);
    todoText.set('');
  }

  const onDoneClick = (id) => {
    todo.markItemAsDone(id);
  }

  console.log('items: ', todo.items.value);
  return (
    <ChakraProvider>
      <div className="App">
        <Heading>Todo Title</Heading>
        <InputGroup size='md' mt='2rem'>
          <Input
            pr='4.5rem'
            type={'text'}
            value={todoText.value}
            onChange={onTodoItemChange}
            placeholder='Enter item to add'
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={onAddClick}>
              Add
            </Button>
          </InputRightElement>
        </InputGroup>
        <List spacing={3} textAlign={'left'} mt='2rem'>
          {Object.values(todo.items.value).map((item) => (
            <ListItem key={item.id} alignItems={'center'}>
              <Checkbox disabled={item.completed} checked={item.completed} mt={'4px'} mr={2} onChange={() => onDoneClick(item.id)} />
              <Text as={item.completed ? 's' : 'b'}>{item.text}</Text>
            </ListItem>
          ))}
        </List>
      </div>
    </ChakraProvider>
  )
}

export default App
