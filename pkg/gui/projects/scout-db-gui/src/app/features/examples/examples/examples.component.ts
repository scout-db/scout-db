import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectIsAuthenticated
} from '../../../core/core.module';

import { State } from '../examples.state';

@Component({
  selector: 'sdbg-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean> | undefined;

  examples = [
    { link: 'todos', label: 'sdbg.examples.menu.todos' },
    { link: 'stock-market', label: 'sdbg.examples.menu.stocks' },
    { link: 'theming', label: 'sdbg.examples.menu.theming' },
    { link: 'crud', label: 'sdbg.examples.menu.crud' },
    { link: 'form', label: 'sdbg.examples.menu.form' },
    { link: 'notifications', label: 'sdbg.examples.menu.notifications' },
    { link: 'elements', label: 'sdbg.examples.menu.elements' },
    { link: 'authenticated', label: 'sdbg.examples.menu.auth', auth: true }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }
}
