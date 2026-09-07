type Species = 'mammal' | 'bird' | 'reptile' | 'amphibian' | 'fish';
type Gender = 'male' | 'female';
type WaterType = 'fresh' | 'salt';

interface IAnimal {
  name: string;
  age: number;
  gender: Gender;
  arial: Array<string>;
  species: Species;

  waterType?: WaterType;
  flightHeight?: number;
  furColor?: number;

  move(): void;
  makeSound(): void;

  run?(speed: number): void;
  fly?(speed: number): void;
  swim?(depth: number): void;
}

class Cat implements IAnimal {
  name: string;
  age: number;
  gender: Gender;
  arial: string[] = ['Europe', 'Azia', 'North America'];
  species: Species = 'mammal';
  furColor: number;

  constructor(name: string, age: number, gender: Gender, furColor: number) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.furColor = furColor;
  }

  move(): void {}

  makeSound(): void {
    console.log('may may');
  }

  run(speed: number): void {
    console.log(`run with speed ${speed}`);
  }
}

class Bird implements IAnimal {
  name: string;
  age: number;
  gender: Gender;
  arial: string[] = ['Azia', 'North America', 'South America'];
  species: Species = 'bird';
  flightHeight: number;

  constructor(name: string, age: number, gender: Gender, flightHeight: number) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.flightHeight = flightHeight;
  }

  move(): void {}

  makeSound(): void {
    console.log('cyrluk cyrluk');
  }

  fly(speed: number): void {
    console.log(`fly on height ${this.flightHeight} with speed ${speed}`);
  }
}

class Fish implements IAnimal {
  name: string;
  age: number;
  gender: Gender;
  arial: string[] = ['Oceania', 'Australia', 'South America'];
  species: Species = 'fish';
  waterType: WaterType;

  constructor(name: string, age: number, gender: Gender, waterType: WaterType) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.waterType = waterType;
  }

  move(): void {}

  makeSound(): void {
    console.log('bul bul');
  }

  swim(depth: number): void {
    console.log(`swim on depth ${depth}`);
  }
}

const cat: Cat = new Cat('markiza', 2, 'female', 0xffa500);
const bird: Bird = new Bird('name', 1, 'male', 330);
const fish: Fish = new Fish('karas', 0.4, 'male', 'fresh');

const animals: Array<IAnimal> = [cat, bird, fish];
animals.forEach((animal) => animal.makeSound());
