abstract class Car {
  public model: string;
  public brand: string;
  public year: number;
  public color: number;
  protected fuelType: string;
  private _code: string;

  constructor(
    brand: string,
    model: string,
    year: number,
    color: number,
    fuelType: string,
    code: string
  ) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.color = color;
    this.fuelType = fuelType;
    this._code = code;
  }

  protected getCode(): string {
    return this._code;
  }

  protected getBaseDescription(): string {
    return `${this.brand} - ${this.model} (${this.year}) | Color: ${this.color} | Fuel: ${this.fuelType} | Code: ${this.getCode()}`;
  }

  public abstract displayInfo(): void;
}

class BMW extends Car {
  public isSportModel: boolean;
  protected engineType: string;
  private _speed: number;

  constructor(
    model: string,
    year: number,
    color: number,
    fuelType: string,
    code: string,
    isSportModel: boolean,
    engineType: string,
    speed: number
  ) {
    super('BMW', model, year, color, fuelType, code);
    this.isSportModel = isSportModel;
    this.engineType = engineType;
    this._speed = speed;
  }

  public displayInfo(): void {
    console.log('== Description car BMW ==');
    console.log(this.getBaseDescription());
    console.log(
      `Is sport model: ${this.isSportModel} | Engine Type: ${this.engineType} | Speed: ${this._speed}`
    );
    console.log('\n');
  }
}

class Volkswagen extends Car {
  public isGolf: boolean;
  protected reabilityLevel: number;
  private _engineVolume: number;

  constructor(
    model: string,
    year: number,
    color: number,
    fuelType: string,
    code: string,
    isGolf: boolean,
    reabilityLevel: number,
    engineVolume: number
  ) {
    super('Volkswagen', model, year, color, fuelType, code);
    this.isGolf = isGolf;
    this.reabilityLevel = reabilityLevel;
    this._engineVolume = engineVolume;
  }

  public displayInfo(): void {
    console.log('== Description car Volkswagen ==');
    console.log(this.getBaseDescription());
    console.log(
      `Is Golf: ${this.isGolf} | Reability level: ${this.reabilityLevel} | Engine volume: ${this._engineVolume}`
    );
    console.log('\n');
  }
}

class Tesla extends Car {
  public autopilotVersion: string;
  protected isSuperchargerSupported: boolean;
  private _batteryCapacity: number;

  constructor(
    model: string,
    year: number,
    color: number,
    fuelType: string,
    code: string,
    autopilotVersion: string,
    isSuperchargerSupported: boolean,
    batteryCapacity: number
  ) {
    super('Tesla', model, year, color, fuelType, code);
    this.autopilotVersion = autopilotVersion;
    this.isSuperchargerSupported = isSuperchargerSupported;
    this._batteryCapacity = batteryCapacity;
  }

  public displayInfo(): void {
    console.log('== Description car Tesla ==');
    console.log(this.getBaseDescription());
    console.log(
      `Autopilot version: ${this.autopilotVersion} | Is supercharger supported: ${this.isSuperchargerSupported} | Battery capacity: ${this._batteryCapacity}`
    );
    console.log('\n');
  }
}

const cars: Array<Car> = [
  new Volkswagen(
    'Golf 8 GTI',
    2022,
    0xff0000,
    'Petrol',
    'WVWZZZCDZNW123456',
    true,
    9,
    2.0
  ),
  new Volkswagen(
    'Passat B8',
    2021,
    0x1f1f1f,
    'Diesel',
    'WVWZZZ3CZME654321',
    false,
    8,
    2.0
  ),
  new Tesla(
    'Model S Plaid',
    2023,
    0xffffff,
    'Electric',
    '5YJSA1E21PF111222',
    'FSD v12',
    true,
    100
  ),
  new Tesla(
    'Model 3 Long Range',
    2022,
    0x0000ff,
    'Electric',
    '5YJ3E1EB2NF333444',
    'Autopilot v3',
    true,
    75
  ),
  new BMW(
    'M5 Competition',
    2023,
    0x000000,
    'Petrol',
    'WBAJF01090B111222',
    true,
    '4.4L V8 Twin-Turbo',
    305
  ),
  new BMW(
    '320i',
    2021,
    0x333333,
    'Petrol',
    'WBA5R11030F333444',
    false,
    '2.0L I4 Turbo',
    240
  ),
];

cars.forEach((car) => {
  car.displayInfo();
});
