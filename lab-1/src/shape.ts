const PI: number = 3.14 as const;

interface IShape {
  getName(): string;
  getArea(): number;
  getPerimeter(): number;
  scale(factor: number): void;
}

class Rectangle implements IShape {
  a: number;
  b: number;

  constructor(a: number, b: number) {
    if (a <= 0 || b <= 0)
      throw new Error('The sides of the figure cannot be negative or zero.');
    this.a = a;
    this.b = b;
  }

  getName() {
    return 'rectangle';
  }

  getArea(): number {
    return this.a * this.b;
  }

  getPerimeter(): number {
    return (this.a + this.b) * 2;
  }

  scale(factor: number): void {
    if (factor <= 0) throw new Error('Scale factor must be greater than zero.');
    this.a = this.a * factor;
    this.b = this.b * factor;
  }
}

class Circle implements IShape {
  radius: number;

  constructor(radius: number) {
    if (radius <= 0)
      throw new Error('The radius of the circle cannot be negative or zero.');
    this.radius = radius;
  }

  getName() {
    return 'circle';
  }

  getDiameter(): number {
    return this.radius * 2;
  }

  getArea(): number {
    return PI * this.radius ** 2;
  }

  getPerimeter(): number {
    return this.getDiameter() * PI;
  }

  scale(factor: number): void {
    if (factor <= 0) throw new Error('Scale factor must be greater than zero.');
    this.radius = this.radius * factor;
  }
}

class Triangle implements IShape {
  a: number;
  b: number;
  c: number;

  constructor(a: number, b: number, c: number) {
    if (a <= 0 || b <= 0 || c <= 0)
      throw new Error('The sides of the figure cannot be negative.');
    if (a + b <= c || a + c <= b || b + c <= a)
      throw new Error('The entered triangle cannot exist..');

    this.a = a;
    this.b = b;
    this.c = c;
  }

  getName() {
    return 'triangle';
  }

  getPerimeter(): number {
    return this.a + this.b + this.c;
  }

  getArea(): number {
    const p: number = this.getPerimeter() / 2;
    return Math.sqrt(p * (p - this.a) * (p - this.b) * (p - this.c));
  }

  scale(factor: number): void {
    if (factor <= 0) throw new Error('Scale factor must be greater than zero.');
    this.a = this.a * factor;
    this.b = this.b * factor;
    this.c = this.c * factor;
  }
}

const shapes: Array<IShape> = [
  new Circle(4),
  new Rectangle(3, 5),
  new Triangle(3, 4, 5),
];

const totalArea = shapes
  .map((shape) => shape.getArea())
  .reduce((total, area) => total + area, 0);
const totalPerimetr = shapes
  .map((shape) => shape.getPerimeter())
  .reduce((total, perimetr) => total + perimetr, 0);

console.log(
  `Shapes area: ${shapes.map((shape) => `${shape.getName()} - ${shape.getArea()}`).join('  ')} : ${totalArea.toFixed(2)} (total)`
);
console.log(
  `Shapes perimetr: ${shapes.map((shape) => `${shape.getName()} - ${shape.getPerimeter()}`).join('  ')} : ${totalPerimetr.toFixed(2)} (total)`
);
