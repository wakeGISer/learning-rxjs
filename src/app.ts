import { Observable } from 'rxjs'
import { createTodoItem } from './lib'

const $input = <HTMLInputElement>document.querySelector('.todo-val');
const $list = <HTMLUListElement>document.querySelector('.list-group');
const $add = document.querySelector('.button-add')

const enter$ = Observable.fromEvent<KeyboardEvent>($input, 'keydown')
    .filter(r => r.keyCode === 13)
// do 操作符一般用来处理 Observable 的副作用，例如操作 DOM，修改外部变量，打 log
    // .do(e => console.log(e))

const clickAdd$ = Observable.fromEvent<MouseEvent>($add, 'click');
const input$ = enter$.merge(clickAdd$)

const app$ = input$
.map(() => $input.value)
.filter(r => r !== '')
.map(createTodoItem)
.do((l: HTMLLIElement) => {
    $list.appendChild(l);
    $input.value = '';
})
// Observable<HTMLLIELEMENT>  => Observable<MouseEvent>  map operator
// and all the items should merge the same event 
.mergeMap($todoItem => {
    return Observable.fromEvent<MouseEvent>($todoItem, 'click')
      .filter(e => e.target === $todoItem)
      .mapTo($todoItem)
})
.do(($todoItem: HTMLLIElement) => {
    if ($todoItem.classList.contains('done')) {
        $todoItem.classList.remove('done')
      } else {
        $todoItem.classList.add('done')
      }
})
.do(r => console.log(r))

app$.subscribe()
