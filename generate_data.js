const express = require('express');
const app = express();
app.get('/', (req, res) => { 
    res.send('A simple Node App is '
        + 'running on this server') 
    res.end() 
}) 
const PORT = process.env.PORT ||5000;
app.listen(PORT,console.log(
    `Server started on port ${PORT}`));

function model(x,z) {
    var y=0
    if (x<10) {
        y=55*Math.pow(x,1.4)+45*Math.pow(x,0.5)
    }
    else if (x<18) {
        y=(500*Math.pow(1+z,-0.7)*Math.exp(-Math.pow(x - 15, 2) / (2 * 1)) / Math.sqrt(2 * Math.PI * 1)
            -500*Math.pow(1+z,-0.7)*Math.exp(-Math.pow(10 - 15, 2) / (2 * 1)) / Math.sqrt(2 * Math.PI * 1)
            +55*Math.pow(10,1.4)+45*Math.pow(10,0.5))
    }
    else if (x<25) {
        y=(700*Math.pow(1+z,1.3)*Math.exp(-Math.pow(x - 22, 2) / (2 * 1.5)) / Math.sqrt(2 * Math.PI * 1.5)
            -700*Math.pow(1+z,1.3)*Math.exp(-Math.pow(18 - 22, 2) / (2 * 1.5)) / Math.sqrt(2 * Math.PI * 1.5)
            +500*Math.pow(1+z,-0.7)*Math.exp(-Math.pow(18 - 15, 2) / (2 * 1)) / Math.sqrt(2 * Math.PI * 1)
            -500*Math.pow(1+z,-0.7)*Math.exp(-Math.pow(10 - 15, 2) / (2 * 1)) / Math.sqrt(2 * Math.PI * 1)
            +55*Math.pow(10,1.4)+45*Math.pow(10,0.5))
    }
    else {
        y=(600*Math.pow(x/25,-5.2)+900*Math.pow(x/25,-10.3)
            -600*Math.pow(1,-5.2)-900*Math.pow(1,-10.3)
            +700*Math.pow(1+z,1.3)*Math.exp(-Math.pow(25 - 22, 2) / (2 * 1.5)) / Math.sqrt(2 * Math.PI * 1.5)
            -700*Math.pow(1+z,1.3)*Math.exp(-Math.pow(18 - 22, 2) / (2 * 1.5)) / Math.sqrt(2 * Math.PI * 1/5)
            +500*Math.pow(1+z,-0.7)*Math.exp(-Math.pow(18 - 15, 2) / (2 * 1)) / Math.sqrt(2 * Math.PI * 1)
            -500*Math.pow(1+z,-0.7)*Math.exp(-Math.pow(10 - 15, 2) / (2 * 1)) / Math.sqrt(2 * Math.PI * 1)
            +55*Math.pow(10,1.4)+45*Math.pow(10,0.5))
    }
    return y
}

class data {
    constructor(z) {
        this.z=z
        this.x=new Array(5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35)
        this.x0=new Array()
        for (var i=0; i<this.x.length; i++){
            this.x0.push(this.x[i]*(1+this.z))
        }
        this.x_error=new Array()
        for (var i=0; i<this.x.length; i++){
            this.x_error.push(0.3*(1+this.z/3)+0.6*(1+this.z/3)*Math.random())
        }
        this.y=new Array()
        for (var i=0; i<this.x.length; i++){
            this.y.push(model(this.x[i],this.z)+0.1*model(this.x[i],this.z)*Math.random())
        }
        this.y_error=new Array()
        for (var i=0; i<this.x.length; i++){
            this.y_error.push(500*Math.random())
        }
    }
}

  
for (var j=0; j<10; j+=0.1) {
    let dat=new data(j)
    const fs = require('fs');
    const data1=JSON.stringify(dat);
    var path = 'z='+j.toString()+'.json'
    fs.writeFileSync(path, data1, err => {
        if (err) {
          throw err
        }
        console.log('JSON data is saved.')
      })
}