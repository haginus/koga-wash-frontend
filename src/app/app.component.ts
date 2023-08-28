import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { routerFadeAnimation } from './animations';
import { User } from './lib/types/User';
import { AuthService } from './services/auth.service';

const SideWidth = 800;
const DEFAULT_TITLE = 'Kogă Wash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerFadeAnimation]
})
export class AppComponent implements OnInit {
  title: string = DEFAULT_TITLE;
  loading = true;
  drawerMode: MatDrawerMode = "over";
  hideDrawer = false;
  hideToolbar = false;
  @ViewChild('drawer') drawer!: MatDrawer;
  user: User | undefined = undefined;

  get suspendedEndDate() {
    if(!this.user || this.user.suspendedUntil === null) return null;
    const date = new Date(this.user?.suspendedUntil);
    if(date.getTime() < Date.now()) return null;
    return new Date(this.user.suspendedUntil).toLocaleDateString("ro-RO");
  }

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.auth.userData.subscribe(user => {
      this.user = user;
      this.loading = false;
    });

    this.drawerMode = window.innerWidth < SideWidth ? "over" : "side";
    this.router.events.pipe(  // code to check for route changes and get route data
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => {
        while (route.firstChild) route = route.firstChild
        return route
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      if(this.drawerMode == 'over') {
        this.drawer.close();
      }
      this.hideDrawer = data['hideDrawer'] === true;
      this.hideToolbar = data['hideToolbar'] === true;
      this.title = data['title'] != undefined ? data['title'] : DEFAULT_TITLE;
      document.title = data['title'] != undefined ? `${data['title']} - ${DEFAULT_TITLE}` : DEFAULT_TITLE;
      if(this.hideDrawer) {
        this.drawer.close();
      } else if(this.drawerMode == 'side') {
        this.drawer.open();
      }
    })
  }

  prepareRoute(outlet: RouterOutlet) {
    if(outlet && outlet.isActivated) {
      if(outlet.activatedRouteData['animate'] === false) {
        return "DoNotAnimate";
      }
      return outlet.activatedRoute;
    }
    return null;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.drawerMode = event.target.innerWidth < SideWidth ? "over" : "side";
    if(this.drawerMode == 'side' && !this.hideDrawer) {
      this.drawer.open();
    }
  }

  signOut() {
    this.auth.signOut();
    this.router.navigate(['login']);
  }
  
}
