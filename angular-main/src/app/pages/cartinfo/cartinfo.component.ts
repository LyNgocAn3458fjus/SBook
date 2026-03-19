import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookStoreAPI } from 'src/app/services/bookstore.services';
import {
  reqDatHangnodategiao,
  reqCTDonHang,
} from '../../services/Classes/DonHang';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cartinfo',
  templateUrl: './cartinfo.component.html',
  styleUrls: ['./cartinfo.component.css'],
})
export class CartinfoComponent implements OnInit {
  constructor(
    private bookapi: BookStoreAPI,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  UserLogin: any;
  Date: any;
  NewDate: any;
  Book: any;
  IDMaDonHang: any;
  Total: number = 0;
  SoluongTon: number = 0;
  mess: any;

  vouchers: any[] = [];
  selectedVoucher: any = null;
  voucherCode: string = '';
  Promotion: number = 0;

  ngOnInit(): void {
    this.actionIn_ngOnInit();
    this.loadVouchers();
  }

  loadVouchers() {
    this.bookapi.getAllVouchers().subscribe({
      next: (data: any) => {
        this.vouchers = data;
      },
      error: (err) => console.error(err),
    });
  }
//Lấy vocher bằng mã
  getVoucherByCode() {
    this.bookapi.getVoucherByCode(this.voucherCode).subscribe({
      next: (data: any) => {
        this.selectedVoucher = data;

        if (this.selectedVoucher) {
          if (
            this.Total >= this.selectedVoucher.minOrderAmount &&
            this.selectedVoucher.quantity > 0
          ) {
            const discountPercentage = this.selectedVoucher.discountPercentage;
            const discountAmount = (this.Total * discountPercentage) / 100;

            this.Promotion = this.Total - discountAmount;

            // ✅ TOAST
            this.toastr.success('Áp dụng voucher thành công 🎟');
          } else {
            this.toastr.error('Không đủ điều kiện dùng voucher');
          }
        }
      },
      error: (err) => console.error(err),
    });
  }

  actionIn_ngOnInit() {
    sessionStorage.removeItem('Mess');

    this.NewDate = new Date();
    this.Date = this.NewDate.toLocaleDateString();

    this.getbook();
    this.Sum();
    this.checkUserLogin();
    this.get_Profile_User();
  }

  get_Profile_User() {
    if (this.checkUserLogin()) {
      const user = JSON.parse(sessionStorage.getItem('UserLogin')!);

      this.bookapi.getProfile(user.id).subscribe({
        next: (data) => {
          this.UserLogin = [data];
          sessionStorage.setItem('UserLogin', JSON.stringify(data));
        },
        error: (err) => console.error(err),
      });
    }
  }

  checkUserLogin() {
    const user = sessionStorage.getItem('UserLogin');

    if (user) {
      const data = JSON.parse(user);

      if (data.id != null) {
        return true;
      }
    }

    return false;
  }

  DatHang() {
    if (this.Book == null) {
      alert('Giỏ Hàng Hiện Tại Đang Trống');

      return;
    }

    const userSession = sessionStorage.getItem('UserLogin');

    if (!userSession) {
      this.router.navigate(['login']);
      return;
    }

    const data = JSON.parse(userSession);

    if (data.Email == null) {
      this.router.navigate(['profile']);
      return;
    }

    const arrayidBook: any[] = [];
    const arraycountBook: any[] = [];

    for (const id of this.Book) {
      arrayidBook.push(id.idcart);
      arraycountBook.push(id.count);
    }

    let Body = new reqDatHangnodategiao(
      false,
      false,
      this.NewDate,
      this.Promotion,
      data.id,
      arrayidBook,
      arraycountBook,
    );

    if (this.selectedVoucher && this.selectedVoucher.code) {
      this.bookapi
        .applyVoucher({
          voucherCode: this.selectedVoucher.code,
          orderTotal: this.Total,
        })
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => console.error(err),
        });
    }

    this.bookapi.DatHang(Body).subscribe({
      next: (data) => {
        if (data.Messager != null) {
          alert(data.Messager);
          return;
        }

        for (let book of this.Book) {
          let body = new reqCTDonHang(
            data._id,
            book.idcart,
            book.count,
            book.unitprice,
          );

          this.bookapi.CTDatHang(body).subscribe({
            next: (data) => {
              if (data.Messager != null) {
                this.mess = data.Messager;
              } else {
                this.Promotion = 0;

                this.mess = 'Đặt Hàng Thành Công';
                this.toastr.success('Đặt hàng thành công');

                if (this.UserLogin[0].Email) {
                  this.bookapi.SendMail(this.UserLogin[0].Email).subscribe({
                    next: () => {},
                    error: (err) => console.error(err),
                  });
                }

                sessionStorage.removeItem('listCart');

                this.Sum();
                this.Book = null;
              }
            },
          });
        }
      },
      error: (err) => console.error(err),
    });
  }
  // xóa sản phẩm
  delete(cartID: any) {
    const sessionCart = JSON.parse(sessionStorage.getItem('listCart')!);

    for (let i = 0; i < sessionCart.length; i++) {
      if (cartID === sessionCart[i].idcart) {
        sessionCart.splice(i, 1);

        // ✅ TOAST
        this.toastr.warning('Đã xóa sản phẩm khỏi giỏ', 'Thông báo');
      }
    }

    if (sessionCart.length <= 0) {
      this.Book = null;
      sessionStorage.removeItem('listCart');
    } else {
      this.Book = sessionCart;
      sessionStorage.setItem('listCart', JSON.stringify(sessionCart));
    }

    this.Sum();
  }

  Sum() {
    const cart = sessionStorage.getItem('listCart');

    if (cart) {
      const sessionCart = JSON.parse(cart);

      this.Total = sessionCart.reduce((acc: any, val: any) => {
        return acc + val.count * val.unitprice;
      }, 0);
    } else {
      this.Total = 0;
    }
  }

  getbook() {
    const cart = sessionStorage.getItem('listCart');

    if (cart) {
      this.Book = JSON.parse(cart);
    } else {
      this.Book = null;
    }
  }

  lessProducts(i: any) {
    const sessionCart = JSON.parse(sessionStorage.getItem('listCart')!);

    sessionCart.forEach((item: any) => {
      if (i == item.idcart && item.count > 1) {
        item.count--;
      }
    });

    sessionStorage.setItem('listCart', JSON.stringify(sessionCart));

    this.Book = sessionCart;
    this.Sum();
  }

  moreProducts(i: any) {
    const sessionCart = JSON.parse(sessionStorage.getItem('listCart')!);

    sessionCart.forEach((item: any) => {
      if (i == item.idcart) {
        if (item.count == item.Soluongton) {
          alert(
            'Hiện Sách ' +
              item.Tensach +
              ' Chỉ Còn: ' +
              item.Soluongton +
              ' Cuốn',
          );
        } else {
          item.count++;
        }
      }
    });

    sessionStorage.setItem('listCart', JSON.stringify(sessionCart));

    this.Book = sessionCart;
    this.Sum();
  }

  onCheckAll() {
    let checkAll = <HTMLInputElement>(
      document.getElementById('checkbox__all-product')
    );

    let checkItems = document.querySelectorAll(
      '#checkbox__product',
    ) as NodeListOf<HTMLInputElement>;

    if (checkAll && checkAll.checked) {
      checkItems.forEach((item) => (item.checked = true));
    } else {
      checkItems.forEach((item) => (item.checked = false));
    }
  }

  ifAllCheck() {
    let checkAll = <HTMLInputElement>(
      document.getElementById('checkbox__all-product')
    );

    return checkAll?.checked || false;
  }

  onDeleteAll() {
    sessionStorage.removeItem('listCart');

    this.toastr.warning('Đã xóa toàn bộ giỏ hàng', 'Thông báo');

    let checkAll = <HTMLInputElement>(
      document.getElementById('checkbox__all-product')
    );

    if (checkAll) checkAll.checked = false;

    this.getbook();
    this.Sum();
  }

  ifEmpty() {
    return this.Book == null;
  }
}
