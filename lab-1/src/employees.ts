interface IPayable {
  pay(): number;
}

abstract class Employee implements IPayable {
  public name: string;
  public age: number;
  public salary: number;

  constructor(name: string, age: number, salary: number) {
    this.name = name;
    this.age = age;
    this.salary = salary;
  }

  public getAnnualBonus(): number {
    return this.salary * this.getBonusRate() * 12;
  }

  protected abstract getBonusRate(): number;

  pay(): number {
    return this.salary + this.salary * this.getBonusRate();
  }
}

class Developer extends Employee {
  public getBonusRate(): number {
    return 0.1;
  }
}

class Manager extends Employee {
  public getBonusRate(): number {
    return 0.2;
  }
}

const employees: Array<Employee> = [
  new Manager('Markus Person', 45, 4500),
  new Manager('Arsen Pushka', 40, 2000),
  new Developer('Jeykob Lock', 24, 1200),
  new Manager('Stive Rodgers', 45, 3900),
  new Developer('Tom Vilson', 50, 3000),
  new Developer('Maks Dolhiy', 34, 2300),
];

const totalBonus = employees.reduce(
  (total, employee) => total + employee.getAnnualBonus(),
  0
);

console.log(`Total year bonus for all employees: ${totalBonus}`);
