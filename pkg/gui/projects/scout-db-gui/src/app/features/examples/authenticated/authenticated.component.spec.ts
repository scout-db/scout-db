import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '../../../shared/shared.module';
import { AuthenticatedComponent } from './authenticated.component';
import { KmcsszApiService } from '../../../shared/kmcssz-api-service';
import { KmcsszApiServiceMock } from '../../../../test/kmcssz-api-service.mock';

describe('AuthenticatedComponent', () => {
  let component: AuthenticatedComponent;
  let fixture: ComponentFixture<AuthenticatedComponent>;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: KmcsszApiService,
          useValue: new KmcsszApiServiceMock(store)
        },
        provideMockStore({
          initialState: {
            auth: {
              isAuthenticated: true
            }
          }
        })
      ],
      imports: [
        SharedModule,
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        TranslateModule.forRoot()
      ],
      declarations: [AuthenticatedComponent]
    }).compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
