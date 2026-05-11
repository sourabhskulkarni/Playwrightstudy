# TypeScript Fundamentals for Test Automation

TypeScript is a superset of JavaScript that adds static typing, making code more maintainable and catching errors at compile time. It is highly recommended for writing Playwright test automation frameworks.

## 1. Basic Types

```typescript
// Primitive types
let name: string = "Sourabh";
let age: number = 30;
let isActive: boolean = true;
let nothing: null = null;
let undefined: undefined = undefined;

// Union types - multiple types allowed
let id: string | number;
id = "ABC123"; // ✅
id = 123;      // ✅

// Any type (avoid when possible)
let anything: any = "flexible";

// Unknown type (safer than any)
let unknownValue: unknown = 42;
```

## 2. Interfaces (Critical for Framework Design)

```typescript
// Basic interface
interface User {
  name: string;
  email: string;
  age?: number;  // Optional property
  readonly id: number;  // Readonly property
}

// Interface extending another
interface Admin extends User {
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
}

// Function interface
interface TestFunction {
  (input: string): Promise<void>;
}

// Usage
const user: User = {
  name: "John",
  email: "john@example.com",
  id: 1
};
```

## 3. Classes and Object-Oriented Programming

```typescript
class Person {
  private age: number;  // Private - not accessible outside
  protected name: string;  // Protected - accessible in subclasses
  public email: string;  // Public - accessible everywhere
  
  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }
  
  // Getter
  getAge(): number {
    return this.age;
  }
  
  // Setter
  setAge(age: number): void {
    if (age > 0) this.age = age;
  }
  
  // Static method
  static createAdmin(): Person {
    return new Person("Admin", 25, "admin@example.com");
  }
}

// Inheritance
class Employee extends Person {
  private employeeId: string;
  
  constructor(name: string, age: number, email: string, employeeId: string) {
    super(name, age, email);
    this.employeeId = employeeId;
  }
}
```

## 4. Generics (for Reusable Components)

```typescript
// Generic function
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const firstNum = getFirstElement<number>([1, 2, 3]);  // number
const firstStr = getFirstElement<string>(['a', 'b']); // string

// Generic interface
interface ApiResponse<T> {
  status: number;
  data: T;
  error?: string;
}

// Generic class
class Repository<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  getAll(): T[] {
    return this.items;
  }
}

// Usage
const userRepo = new Repository<User>();
const userData = userRepo.getAll(); // Type: User[]
```

## 5. Enums (Named Constants)

```typescript
// String enum
enum TripType {
  OneWay = "OneWay",
  RoundTrip = "RoundTrip",
  MultiCity = "MultiCity"
}

// Numeric enum
enum BrowserType {
  Chrome = 0,
  Firefox = 1,
  Safari = 2
}

// Usage
const tripType: TripType = TripType.RoundTrip;
const browser: BrowserType = BrowserType.Chrome;
```

## 6. Type Aliases vs Interfaces

```typescript
// Type alias - more flexible
type StringOrNumber = string | number;
type Status = 'active' | 'inactive' | 'pending';

// Can be used for primitives and unions
type Point = {
  x: number;
  y: number;
};

// Interface - better for objects and OOP
interface Shape {
  area(): number;
}

// Best practice:
// - Use Interface for object shapes
// - Use Type for unions and primitives
```

## 7. Decorators (Advanced - for Frameworks)

```typescript
// Custom decorator
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = await originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  
  return descriptor;
}

// Usage
class TestRunner {
  @Log
  async runTest(): Promise<void> {
    console.log("Test running");
  }
}
```

## 8. Async/Await and Promises

```typescript
// Promise type
function fetchData(): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Data"), 1000);
  });
}

// Async function returns Promise
async function getData(): Promise<string> {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Promise.all - execute multiple promises
async function executeMultiple(): Promise<[string, string]> {
  const result = await Promise.all([
    fetchData(),
    fetchData()
  ]);
  return result;
}
```

## 9. Advanced Types

```typescript
// Partial - make all properties optional
interface User {
  name: string;
  email: string;
}

type PartialUser = Partial<User>;  // Both properties optional

// Required - make all properties required
type RequiredUser = Required<PartialUser>;

// Readonly - all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick - select specific properties
type UserBasic = Pick<User, 'name'>;

// Omit - exclude specific properties
type UserWithoutEmail = Omit<User, 'email'>;

// Conditional types
type IsString<T> = T extends string ? true : false;
type A = IsString<'hello'>;  // true
type B = IsString<42>;       // false
```

## 10. Modules and Imports

```typescript
// Export
export interface TestConfig {
  timeout: number;
}

export class TestRunner {}

export default class DefaultExport {}

// Import
import { TestConfig, TestRunner } from './types';
import DefaultClass from './default';
import * as All from './all';
```

## TypeScript Best Practices for Test Automation

- ✅ Always use strict type checking
- ✅ Create interfaces for data structures
- ✅ Use enums for fixed values
- ✅ Leverage generics for reusable code
- ✅ Use async/await for promises
- ✅ Apply decorators for cross-cutting concerns
- ✅ Keep types DRY (Don't Repeat Yourself)
- ✅ Document complex types with comments
