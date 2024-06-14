import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isScreenSmall: boolean = false;
  rol: string = "ADMIN";
  user: string = "JHON DOE";

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {}

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 800px)'])
      .subscribe(result => {
        this.isScreenSmall = result.matches;
        if (this.isScreenSmall) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }

  toggleMenu() {
    this.sidenav.toggle();
  }

  logOut(): void {

    this.router.navigateByUrl('');
  }
}
