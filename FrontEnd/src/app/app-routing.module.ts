import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: 
    () => import('./recipes/recipe.module').then(module => module.RecipeModule)},
  { path: 'auth', loadChildren: 
    () => import('./auth/auth.module').then(module => module.AuthModule)},
  { path: 'shopping-list', loadChildren:
    () => import('./shopping-list/shopping-list.module').then(module => module.ShoppingListModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
