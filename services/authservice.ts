import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyCDDwa9DrgySikEq7waBfXJK1wszeZVtDI",
  authDomain: "githubbattle-7edf6.firebaseapp.com",
  databaseURL: "https://githubbattle-7edf6.firebaseio.com"
});

const provider = new firebase.auth.GithubAuthProvider();

let token, user, listeners = [];

@Injectable()
export class AuthService {
  constructor(){
    firebase.auth().onAuthStateChanged(()=>{
      listeners.forEach(cb=> cb(this.getAuthState()));
    });
  }
  listenToAuthChanges(callback){
    listeners.push(callback);
    callback(this.getAuthState());
  }
  getAuthState(){
    return {token,user};
  }
  signInWithPopup(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
      token = result.credential.accessToken;
      user = result.user;
    }).catch(function(error) {
      console.log("Authentication error",error)
    });
  }  
}
