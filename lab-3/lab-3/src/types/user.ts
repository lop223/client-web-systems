export interface User {
  id: number;
  gender: "male" | "female";
  name: { title: string; first: string; last: string };
  location: {
    street: { number: number; name: string };
    city: string;
    country: string;
  };
  email: string;
  phone: string;
  picture: { large: string };
  dob: { date: string; age: number };
  hobbies: string[];
  details: string;
}
