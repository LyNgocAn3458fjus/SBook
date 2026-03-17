import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookStoreAPI } from 'src/app/services/bookstore.services';
import { itemCart } from 'src/app/services/Classes/Book';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-bookdetails',
  templateUrl: './bookdetails.component.html',
  styleUrls: ['./bookdetails.component.css']
})
export class BookdetailsComponent implements OnInit {

  id!: string;
  book: any;
  unitprice: number = 0;
  Soluongton: number = 0;

  quantity: number = 1;

  listCart: itemCart[] = [];
  listSameCategoryBooks: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookapi: BookStoreAPI,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getBook(this.id);
  }

  // giảm số lượng
  lessProducts() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // tăng số lượng
  moreProducts() {
    if (this.quantity < this.Soluongton) {
      this.quantity++;
    }
  }

  // lấy chi tiết sách
  getBook(id: string) {
    this.bookapi.get1Book(id).subscribe({
      next: (data: any) => {

        this.book = data.data;
        this.listSameCategoryBooks = data.BookLienQuan;

        if (this.book && this.book.length > 0) {
          this.unitprice = this.book[0].Giaban;
          this.Soluongton = this.book[0].Soluongton;
        }

      },
      error: (err) => {
        console.error("Load book failed", err);
      }
    });
  }

  // kiểm tra hết hàng
  checkSoluongton(): boolean {
    return this.Soluongton <= 0;
  }

  // thêm vào giỏ hàng
  addCart() {
    if (!this.book || this.book.length === 0) {
      this.toastr.error('Không có dữ liệu sách');
      return;
    }
    const newItem = new itemCart();

    newItem.idcart = this.id;
    newItem.count = this.quantity;
    newItem.unitprice = this.unitprice;
    newItem.Anh = this.book[0].Anh;
    newItem.Mota = this.book[0].Mota;
    newItem.Soluongton = this.book[0].Soluongton;
    newItem.Tensach = this.book[0].Tensach;

    const sessionCart = JSON.parse(sessionStorage.getItem('listCart') || '[]');

    const index = sessionCart.findIndex((x: any) => x.idcart === newItem.idcart);

    if (index === -1) {
      sessionCart.push(newItem);
    } else {
      sessionCart[index].count += newItem.count;
    }

    sessionStorage.setItem('listCart', JSON.stringify(sessionCart));

    // ✅ TOAST XỊN
    this.toastr.success('Đã thêm vào giỏ hàng', 'Thành công 🎉');
  }

  // carousel sách liên quan
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['Trước', 'Sau'],
    responsive: {
      0: { items: 2 },
      400: { items: 3 },
      740: { items: 4 },
      940: { items: 4 }
    },
    nav: true
  };

  // chuyển sang sách khác
  goDetails(id: string) {
    this.router.navigate(['detail', id]).then(() => {
      window.location.reload();
    });
  }
}
