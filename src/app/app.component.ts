import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    todos: Array<any> = [];
    removed: Array<any> = [];
    addTodoForm: any;
    onLoad: any;
    toggleErrors: boolean;

    constructor(
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.init();

    }

    init() {
        this.onLoad = JSON.parse(localStorage.getItem('todos'));
        this.initForms();

        if (localStorage.getItem('todos')) {
            const retrievedData = localStorage.getItem('todos');
            this.todos = JSON.parse(retrievedData);
        } else {
            this.save();
        }
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    initForms() {
        this.addTodoForm = this.fb.group({
            todoName: ['', Validators.required],
            todoDate: ['']
        });
    }

    addTodo() {
        console.log(this.addTodoForm);
        if (this.addTodoForm.status === 'VALID') {
            this.todos.push(
                {
                    name: this.addTodoForm.value.todoName,
                    date: this.formatDate(this.addTodoForm.value.todoDate),
                    isDone: false
                }
            );
            this.toggleErrors = false;
            this.save();
            this.initForms();
        } else {
            this.toggleErrors = true;
        }
    }

    removeTodo(index) {
        this.removed = [];
        this.todos[index].removeIndex = index;
        this.removed.push(this.todos[index]);
        this.todos.splice(index, 1);
        this.save();
    }

    formatDate(customDate) {
        if (customDate !== '') {
            customDate = customDate.toString();
            console.log(customDate);
            const rawDate = customDate.split(' ');
            const day = rawDate[2];
            const month = rawDate[1];
            const year = rawDate[3];

            return `${day} ${month} ${year}`;
        } else {
            return '';
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
        this.save();
    }

    toggleChecked(index) {
        const current = this.todos[index];

        if (current.isDone) {
            current.isDone = false;
        } else {
            current.isDone = true;
        }

        this.save();
    }

    undoItem() {
        const index = this.removed[0].removeIndex;
        this.todos.splice(index, 0, this.removed[0]);
        this.removed = [];
        this.save();
    }
}
