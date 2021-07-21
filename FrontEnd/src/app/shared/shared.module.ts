import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinner } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";


@NgModule({
    declarations: [
        DropdownDirective,
        PlaceholderDirective,
        LoadingSpinner,
        AlertComponent
    ],
    imports: [
        CommonModule
    ],
    exports : [
        CommonModule,
        DropdownDirective,
        PlaceholderDirective,
        LoadingSpinner,
        AlertComponent
    ]
})
export class SharedModule {

}