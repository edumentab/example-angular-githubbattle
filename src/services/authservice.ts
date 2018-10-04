/*
A service for handling authentication.
Used in UrlService and in the App component.

Uses the firebase authentication API for a clean interface with Github auth.
This is just to save us from having do low-level auth stuff, we're not
using any other part of Firebase.
*/

import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import {AuthCredential, UserCredential} from '@firebase/auth-types';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyCDDwa9DrgySikEq7waBfXJK1wszeZVtDI",
  authDomain: "githubbattle-7edf6.firebaseapp.com",
  databaseURL: "https://githubbattle-7edf6.firebaseio.com"
});

const provider = new firebase.auth.GithubAuthProvider();

@Injectable()
export class AuthService {
  private listeners = [];
  private token;
  private user;
  private error;
  constructor(){
    firebase.auth().onAuthStateChanged(()=>this.notifyListeners());
  }
  notifyListeners(){
    this.listeners.forEach(cb=> cb(this.authState));
  }
  listenToAuthChanges(callback){
    this.listeners.push(callback);
    callback(this.authState);
  }
  get authState(){
    return {token: this.token,user: this.user, error: this.error};
  }
  signInWithPopup(){
    firebase.auth().signInWithPopup(provider).then(result => {
      // @ts-ignore (typedef seems to be missing the accessToken?)
      this.token = result.credential.accessToken;
      this.user = result.user;
      delete this.error;
      this.notifyListeners();
    }).catch(error => {
      this.error = error;
      this.notifyListeners();
    });
  }  
}
