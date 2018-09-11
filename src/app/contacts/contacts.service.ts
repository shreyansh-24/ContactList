import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(private http: HttpClient) {}
  private newContactAdded = new Subject();

  contacts: any = [];

  // getContactAddedListener() {
  //   return this.newContactAdded.asObservable();
  // }

  getContacts() {
    this.http
      .get<{ message: string; contacts: string }>(
        'http://localhost:3000/api/contacts'
      )
      .subscribe(contactsData => {
        this.contacts = contactsData.contacts;
        this.newContactAdded.next(this.contacts);
      });
    return this.newContactAdded.asObservable(); // now this observable subject can be 'subscribed to', in any component

    //    return [...this.contacts];
    //  this.http.get('http://localhost:3000/api/contacts')
    //   .subscribe( (data) => {
    //     this.contacts = data;

    //   });
  }

  getonecontact(id: string) {
    return this.contacts.find(contact => contact._id === id);

  }

  addNewContact(cname: string, cnum: string) {
    // in argument of a methods, comes what input we expect to be coming
    // creating the object to post now
    const contact: any = { cname: cname, cnum: cnum };
    this.http.post<{message: string}>('http://localhost:3000/api/contacts/', contact)
      .subscribe((responseData) => {
          console.log(responseData.message);
        this.contacts.push(contact); // updating posts locally as fetching is not real time
      });


    // this.newContactAdded.next(this.contacts);
  }

  deleteContact(deleteId: string) {

    // console.log(deleteId);
    this.http.delete<{message: string, contacts: string}>('http://localhost:3000/api/contacts/' + deleteId)
      .subscribe((response) => {
     // console.log(response.contacts);
      this.contacts = response.contacts;
      this.newContactAdded.next(this.contacts);
     // console.log(this.contacts);
      });
  }



}
