import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BookStoreAPI } from '../../services/bookstore.services';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private bookstore: BookStoreAPI,
    private router: Router,
    private toastr: ToastrService
  ) { }

  UserLogined: any;
  username: String = '';
  password: String = '';

  ngOnInit() {}

  clickme() {

    let check = []
    check.push(!(this.username == ''));
    check.push(!(this.password == ''));

    if (check.every(va => va === true)) {

      this.bookstore.postLogin(this.username, this.password)
        .subscribe({

          next: (data) => {

            this.UserLogined = data;

            sessionStorage.setItem(
              'UserLogin',
              JSON.stringify(data)
            )

            this.toastr.info(this.UserLogined.Messenger);

            if (this.UserLogined.Messenger == "Đăng Nhập Thành Công") {
              this.router.navigate(['']);
            }

          },

          error: (err) => {

            this.toastr.error("Đăng nhập thất bại");

            console.error(err);

          }

        })

    } else {

      this.toastr.warning("Vui Lòng Điền Đầy Đủ Thông Tin")

    }

  }
}
