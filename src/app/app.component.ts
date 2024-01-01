import {Component, Injectable} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Observable} from "rxjs";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable({
  providedIn: 'root',
})
export class AppComponent {


  private apiUrl = 'https://localhost:7270/api/MontyHall';
  private _http : HttpClient ;


  constructor( http: HttpClient) {
    this._http = http;
  }

  ngOnInit(): void {
    this.getData().subscribe((result) => {
        console.log(result);
      },error=>{
        console.log(error);      
      });
      console.log("Just started thge page")
      this.doors = this.shuffleArray();
    // this.getData();
  }

  getData(): Observable<any> {
    return this._http.get<any>(this.apiUrl);
  }

  tempdoors: { prize: string, revealed: boolean, imagePath: string }[] = [
    { prize: 'Goat', revealed: false, imagePath: '../assets/montyhall.png' },
    { prize: 'Goat', revealed: false, imagePath: 'assets/montyhall.png' },
    { prize: 'Car', revealed: false, imagePath: 'assets/car.jpg' }
  ];
  doors:{ prize: string, revealed: boolean, imagePath: string }[] = [];

  shuffleArray() {
    for (let i = this.tempdoors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tempdoors[i], this.tempdoors[j]] = [this.tempdoors[j], this.tempdoors[i]];
    }
    return this.tempdoors;
  }

// Shuffle the array

  selectedDoor: number | null = null;
  revealedGoatDoor: number | null = null;
  instructionMessage = 'Pick a Door';
  showSwitchButton = false;
  showPlayAgainButton = false;

  totalSwitches = 0;
  totalStays = 0
  pickDoor(index: number): void {

    // this.doors = this.shuffleArray();
    if (this.selectedDoor === null) {
      this.selectedDoor = index;
      this.instructionMessage = 'You selected Door ' + (index + 1) + '. Revealing one of the doors with a goat...';

      const goatDoors: number[] = [];
      this.doors.forEach((door, i) => {
        if (door.prize === 'Goat' && i !== this.selectedDoor) {
          goatDoors.push(i);
        }
      });

      const randomGoatIndex = goatDoors[Math.floor(Math.random() * goatDoors.length)];
      this.revealedGoatDoor = randomGoatIndex;

      this.instructionMessage = `You selected Door ${index + 1}. Door ${randomGoatIndex + 1} has a goat. Do you want to switch or stay?`;

      this.showSwitchButton = true;
      this.doors[randomGoatIndex].revealed = true;
    }
  }

  switchDoor(switchDoor: boolean): void {
    if (this.selectedDoor !== null && this.revealedGoatDoor !== null) {
      const remainingDoorIndexes = [0, 1, 2].filter(door => door !== this.selectedDoor && door !== this.revealedGoatDoor);
      const remainingDoor = switchDoor ? remainingDoorIndexes[0] : this.selectedDoor;

      if (this.doors[remainingDoor].prize === 'Car') {
        const finalChoice = switchDoor ? 'Switched' : 'Stayed';
        this.instructionMessage = `Congratulations! You ${finalChoice} and won a car!`;
      } else {
        const finalChoice = switchDoor ? 'Switched' : 'Stayed';
        this.instructionMessage = `Sorry! You ${finalChoice} and got a goat!`;
      }

      this.doors.forEach((door, i) => {
        door.revealed = true;
      });
      this.showSwitchButton = false;
      this.showPlayAgainButton = true;

      if (switchDoor) {
        this.totalSwitches++;
      } else {
        this.totalStays++;
      }

      const montyHallResult = {
        selectedDoor: this.selectedDoor + 1, // Add 1 because the backend uses 1-based indexing
        shouldSwitch: switchDoor,
        playerWins: this.instructionMessage.includes('Congratulations'),
      };

      this._http.post(this.apiUrl, montyHallResult).subscribe(
        response => console.log('Data sent successfully!', response),
        error => console.error('Error sending data:', error)
      );
    }
  }

  resetGame(): void {
    this.selectedDoor = null;
    this.revealedGoatDoor = null;
    this.instructionMessage = 'Pick a Door!';
    this.showSwitchButton = false;

    // Resetting the revealed state for each door
    this.doors.forEach(door => door.revealed = false);

    // Hide Play Again button on game reset
    this.showPlayAgainButton = false;

    this.shuffleArray();
  }

}






