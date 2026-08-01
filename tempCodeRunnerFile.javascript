console.log("rohan");

class person{
  constructor(name, age){
    this.name = name;
    this.age = age;
  }

 details(){
    console.log(`Name: ${this.name}, Age: ${this.age}`);
  }
}
person1 = new person("Rohan", 25);
person1.details();

const a =()=>{
  return 1+2;
}
console.log(a());