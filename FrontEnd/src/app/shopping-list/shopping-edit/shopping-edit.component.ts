import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListAction from '../store/shopping-list.action';
import * as fromAppReducer from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: true }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(
    private slService: ShoppingListService,
    private store: Store<fromAppReducer.AppState>) { }

  ngOnInit() {
    // this.subscription = this.slService.startedEditing
    this.subscription = this.store.select('shoppingList')
      .subscribe(
        (stateData) => {
          if (stateData.editedItemIndex > -1) {
            this.editedItemIndex = stateData.editedItemIndex;
            this.editMode = true;
            this.editedItem = stateData.editedItem;
            this.slForm.setValue({
              name: this.editedItem.name,
              amount: this.editedItem.amount
            })
          }
        }
      );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.slService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListAction.UpdateIngredient(
        { ingredient: newIngredient }));
    } else {
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListAction.AddIngredient(newIngredient));
    }
    this.editMode = false;
    form.reset();
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }

  onDelete() {
    // this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListAction.DeleteIngredient())
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }

}
