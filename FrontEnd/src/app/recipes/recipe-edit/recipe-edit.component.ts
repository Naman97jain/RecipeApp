import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipe.service';
import { CommonService } from 'src/app/shared/common.service';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import { map, take } from 'rxjs/operators';
import { typePropertyIsNotAllowedMsg } from '@ngrx/store/src/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  storeSub: Subscription;

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private commonService: CommonService,
    private router: Router,
    private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  get ingredientControl() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  onSubmit() {
    let newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']);
    if (this.editMode) {
      this.store.select('recipe').pipe(take(1), map(
        recipeState => {
          return recipeState.recipes;
        }
      ), map(
        (recipeState => recipeState.find((recipe, index) => {
          return index === this.id;
        })
      )), map(recipe => {
        newRecipe["id"] = recipe["recipe_id"];
        return newRecipe;
      })
    ).subscribe((recipe: Recipe) => {
        this.store.dispatch(new RecipeActions.UpdateRecipe({newRecipe: newRecipe, id: recipe["recipe_id"]}));
      })
      // newRecipe["id"] = this.recipeService.getRecipeId(this.id);
      // this.commonService.updateRecipe(newRecipe).subscribe(
      //   recipe => {
      //     this.store.dispatch(new RecipeActions.FetchRecipes());
      //   }
      // );
    } else {
      // console.log(this.editMode)
      // this.commonService.addRecipe(this.recipeForm.value).subscribe(
      //   recipe => {
      //     this.store.dispatch(new RecipeActions.FetchRecipes());
      //   }
      // );
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      
      this.store.select('recipe').pipe(map(
        recipeState => {
          return recipeState.recipes;
        }
      ),map(
          (recipeState => recipeState.find((recipe, index) => {
            return index === this.id;
          })
        ))
      ).subscribe((recipe: Recipe) => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              })
            );
          }
        }
      })
      // const recipe = this.recipeService.getRecipe(this.id);
      // recipeName = recipe.name;
      // recipeImagePath = recipe.imagePath;
      // recipeDescription = recipe.description;
      // if (recipe['ingredients']) {
      //   for (let ingredient of recipe.ingredients) {
      //     recipeIngredients.push(
      //       new FormGroup({
      //         'name': new FormControl(ingredient.name, Validators.required),
      //         'amount': new FormControl(ingredient.amount, [
      //           Validators.required,
      //           Validators.pattern(/^[1-9]+[0-9]*$/)
      //         ])
      //       })
      //     );
      //   }
      // }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  ngOnDestroy(){
    if (this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

}
