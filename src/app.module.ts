import { NgModule } from '@angular/core';

import { ComponentModule } from './components/components.module';
import { ServiceModule } from './services/services.module';

import { AppComponent } from './components/app';

@NgModule({
    imports: [ ComponentModule, ServiceModule ],
    bootstrap: [ AppComponent ],
})
export class AppModule {}