interface Course {
  name: string;
  duration: number;
  students: Array<string>;
}

class OnlineCourse implements Course {
  public name: string;
  public duration: number;
  private _students: Array<string> = [];

  constructor(name: string, duration: number) {
    this.name = name;
    this.duration = duration;
  }

  public get students(): Array<string> {
    return [...this._students];
  }

  public isStudentRegistered(student: string): boolean {
    return this._students.includes(student);
  }

  public registerStudent(student: string): void {
    if (this.isStudentRegistered(student))
      throw new Error(`This sudent '${student}' already registered.`);

    this._students.push(student);
  }
}

class CourseManager {
  private _courses: Array<Course> = [];

  public get courses(): Array<Course> {
    return [...this._courses];
  }

  private _normalize(str: string): string {
    return str.trim().toLowerCase();
  }

  public findCourseByName(name: string): Course | undefined {
    return this._courses.find(
      (course) => this._normalize(course.name) === this._normalize(name)
    );
  }

  public addCourse(course: Course): void {
    if (this.findCourseByName(course.name))
      throw new Error(`This course '${course.name}' is alerady exist.`);
    this._courses.push(course);
  }

  public removeCourseByName(name: string): boolean {
    const targetName = this._normalize(name);
    const lengthOnStart = this._courses.length;
    this._courses = this._courses.filter(
      (course) => this._normalize(course.name) !== targetName
    );

    return this._courses.length < lengthOnStart;
  }
}

const manager = new CourseManager();

const tsCourse = new OnlineCourse('TypeScript', 30);
const reactCourse = new OnlineCourse('React', 45);

tsCourse.registerStudent('Maksum');
tsCourse.registerStudent('Denis');

manager.addCourse(tsCourse);
manager.addCourse(reactCourse);

const found = manager.findCourseByName('typescript');
console.log(`Found course: ${found?.name}, students:`, found?.students);

const isRemoved = manager.removeCourseByName('react');
console.log(`Course deleted: ${isRemoved}`);
console.log(`Courses remaining: ${manager.courses.length}`);
