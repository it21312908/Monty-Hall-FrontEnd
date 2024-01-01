import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let fixture;
  let app: {
    instructionMessage(instructionMessage: any): unknown; selectedDoor: any; revealedGoatDoor: any; 
};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should initialize with null selectedDoor and revealedGoatDoor', () => {
    expect(app.selectedDoor).toBeNull();
    expect(app.revealedGoatDoor).toBeNull();
  });

  it('should initialize with instructionMessage "Pick a Door!"', () => {
    expect(app.instructionMessage).toBe('Pick a Door!');
  });

  
});
