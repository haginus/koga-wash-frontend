import { Component, Input } from '@angular/core';
import { User } from 'src/app/lib/types/User';

@Component({
  selector: 'app-user-snippet',
  templateUrl: './user-snippet.component.html',
  styleUrls: ['./user-snippet.component.scss']
})
export class UserSnippetComponent {

  constructor() { }

  @Input() user: User;

  makeLink(url: string) {
    if(url.startsWith('http')) {
      return url;
    }
    return '//' + url;
  }
}
