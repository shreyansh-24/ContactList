import { Component, OnInit} from '@angular/core';
import { ContactsService } from '../contacts.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.css']
})
export class ContactlistComponent implements OnInit {

contacts: any = [];
legituser = false;
  // contacts: any = [

  //   { cname: 'Shreyansh' , cnum: '9461172640'  },
  //   { cname: 'Shubham' , cnum: '8889562354' },
  //   { cname: 'Chaitanaya' , cnum: '6965874525' },
  //   { cname: 'Sambhav' , cnum: '6965874525' }

  // ];

  constructor( public contactsService: ContactsService, private authService: AuthService ) { }

  ngOnInit() {
    this.contactsService.getContacts()
    .subscribe((contacts) => {
      this.contacts = contacts;

    });

    this.legituser = this.authService.getAuthStatus();

    this.authService.getAuthstatusListener().subscribe((userinfo) => {
      this.legituser = userinfo;
    });
  }

  onDelete(deleteId: string) {
   // console.log(deleteId);
    this.contactsService.deleteContact(deleteId);
  }

}
