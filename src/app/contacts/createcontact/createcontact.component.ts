import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactsService } from '../contacts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-createcontact',
  templateUrl: './createcontact.component.html',
  styleUrls: ['./createcontact.component.css']
})
export class CreatecontactComponent implements OnInit {

  public form: FormGroup;
  // imagePreview: string;
  contactId: string;
  mode = 'create';
  contact: string;


  constructor( public contactsService: ContactsService, public route: ActivatedRoute) { }
// ActivatedRoute package gives us leverage to access the parameters attached with the router link

  ngOnInit() {
    this.form = new FormGroup({
      cname: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      cnum: new FormControl(null, Validators.required ),
     // image: new FormControl(null, { validators: [Validators.required] })

    });

    this.route.paramMap.subscribe(( paramMap: ParamMap ) => {
      if (paramMap.has('contactId')) {
        this.mode = 'edit';
        this.contactId = paramMap.get('contactId');
        this.contact = this.contactsService.getonecontact(this.contactId);
      } else {
        this.mode = 'create';
        this.contactId = null;
      }
    });
  }

  // onImageSelected(event: Event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({image: file});
  //   this.form.get('image').updateValueAndValidity();
  //   console.log(file);
  //   console.log(this.form);
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result;
  //   };
  //   reader.readAsDataURL(file);
  // }
  onSavePost() {

    this.contactsService.addNewContact(this.form.value.cname, this.form.value.cnum);
   this.form.reset();
  }
}
