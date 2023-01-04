import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    'email': new FormControl(null, [Validators.email, Validators.required]),
    'password': new FormControl(null, [Validators.minLength(6), Validators.required]),
  });

  loading = false;

  captchaToken: string = null;

  @ViewChild('captcha') captchaComponent: RecaptchaComponent;

  solvedCaptcha(captchaToken: string) {
    this.captchaToken = captchaToken;
  }

  ngOnInit(): void {
  }

  signIn(): void {
    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value;
    this.auth.signInWithEmailAndPassword(email, password, this.captchaToken).subscribe(res => {
      if(res.user) {
        this.router.navigate(["/", res.user?.role]);
      } else {
        this.captchaComponent.reset();
      }
    });
  }

}
