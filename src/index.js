class Animal {
  constructor(name){
    this.name = name;
  }
  getName(){
    console.log("||")
    return this.name;
  }
}

const dog = new Animal('dog');
console.log(dog.name);

import './index.less';