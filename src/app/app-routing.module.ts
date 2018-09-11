import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreatecontactComponent } from './contacts/createcontact/createcontact.component';
import { ContactlistComponent } from './contacts/contactlist/contactlist.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: ContactlistComponent },
  { path: 'create', component: CreatecontactComponent, canActivate: [AuthGuard] },
  { path: 'edit/:contactId', component: CreatecontactComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

 }
