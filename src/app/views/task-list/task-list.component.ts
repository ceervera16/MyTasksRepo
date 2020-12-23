import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {Task} from '../../services/tasks/model/task';

import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TasksService } from 'src/app/services/tasks';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  @ViewChild('dialog', {static: false})
  public dialog: TemplateRef<any>;
  taskStatusOpts = [
    {
      value: 'inProgress',
      label: 'In progress'
    },
    {
      value: 'pending',
      label: 'Pending'
    },
    {
      value: 'finished',
      label: 'Finished'
    }
  ];
  tasks;

  newTaskData = {
    show: false,
    control: new FormControl('')
  };

  deleteTaskData = {
    index: null,
    dialog: null
  };
  
  constructor(private matDialog: MatDialog, private _snackBar: MatSnackBar, private _tasksService: TasksService ) {}

  ngOnInit(): void {
    this.getTasksBack();
    this.tasks=this.getTasksBack();

    //TODO: Get tasks
    // this.tasks = [];
    // for (let i = 0; i < 10; i++) {
    //   this.tasks.push({ id: i, description: 'Description of Task ' + i, status: this.taskStatusOpts[(i%3)].value});
    // }

  }

  public newTask() {
    this.newTaskData.show = true;
    this.newTaskData.control.setValue('');
  }
  

  public getTasksBack(){
     this._tasksService.listTasks().subscribe(
      value => {
       console.log('task: ' + value);
       this.tasks = value;
      }, err => {
        console.log(err);
  });
  }

  public createTask() {
    const newTask = {
      id: this.tasks.length +1,
      status: 'pending',
      description: this.newTaskData.control.value
    }
    console.log('Creating task', newTask);
    //TODO: Add task
    this._tasksService.addTask(newTask).subscribe(
      
      value => {
       console.log('task: ' + value);
      }, err => {
        console.log(err);
  });
  this.newTaskData.show = false;
     this.newTaskData.control.setValue('');
    this.tasks.push(newTask);
    this.getTasksBack();
    this.openSnackBar('Task created successfully','');
    console.log('Tarea creada con exito');
  }

  public cancelNewTask() {
    this.newTaskData.show = false;
    this.newTaskData.control.setValue('');
  }

  public updateTask(idx) {
    const taskToUpdate = this.tasks[idx];
    if (taskToUpdate) {
      this._tasksService.updateTask(taskToUpdate).subscribe(
      
        value => {
         console.log('Updating task', taskToUpdate);
      //TODO Update Task
      this.openSnackBar('Task with id ' + taskToUpdate.id + ' updated successfully','');
        }, err => {
          console.log(err);
    })
      
    }
  }

  public deleteTask(idx) {
    this.deleteTaskData.index = idx;
    this.deleteTaskData.dialog = this.matDialog.open(this.dialog);
  }

  deleteConfirmBack(){ //TODO implementar back
    const taskToDelete = this.tasks[this.deleteTaskData.index];
    if (taskToDelete) {
      console.log('Deleting task', taskToDelete);
  this._tasksService.deleteTask(taskToDelete).subscribe(
      
    value => {
     console.log('task: ' + value);
     this.openSnackBar('Task with id ' + taskToDelete.id + ' removed successfully','');
     this.tasks = value;
     this.deleteTaskData.dialog.close();
     this.deleteTaskData.index = null;
     this.deleteTaskData.dialog = null;
     this.getTasksBack();
    }, err => {
      console.log(err);
});
    }
   
  }

  public deleteCancel() {
    this.deleteTaskData.dialog.close();
    this.deleteTaskData.index = null;
    this.deleteTaskData.dialog = null;
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
