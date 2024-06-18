class Gaussian {
    constructor(mean, variance,A) {
        this.mean = mean;
        this.variance = variance;
        this.a = A;
    }

    pdf(x) {
        return this.a*Math.exp(-Math.pow(x - this.mean, 2) / (2 * this.variance));
    }
}

class Gaussian_series{
    constructor(){
        this.series = new Array()
        this.add_element = function(mean, variance, A){
            this.series.push(new Gaussian(mean, variance, A))
        }
        this.delete_element = function(index){
            this.series.splice(index, 1)
        }
        this.change_mean = function(index, mean){
            this.series[index].mean = mean
        }
        this.change_variance = function(index, variance){
            this.series[index].variance = variance
        }
        this.change_A = function(index, A){
            this.series[index].a = A
        }
    }

    pdf(x) {
        var y = 0
        for (var i=0; i<this.series.length; i++){
            y+=this.series[i].pdf(x)
        }
        return y
    }
}

var determinator = 0

var gaussians = new Gaussian_series()

var limit = {
  min: 0,
  max: 40
}

var z = new Array()
for (var i =0; i<10;i+=0.1){
    z.push(i.toString())
}

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

function getRandomData(callback){
    var i=getRandomInt(z.length)
    var path = './z='+z[i]+'.json'
    console.log(path)
    fetch(path).then((res)=>{if (!res.ok) {
        throw new Error
            (`HTTP error! Status: ${res.status}`);
    }
    return res.json();
    }).then((data0)=>{
        console.log(data0)
        callback(data0)
        return data0
    }).catch((err)=>{
        console.log(err)
    })
}


function displayRandomData(data0){
    // var data0 = getRandomData()
    console.log(data0)
    var mychart = echarts.init(document.getElementById('main'));
    const dimensions = [
        'name', 'M', 'number', 'number min', 'number max', 'M min', 'M max'
    ];
    var data = new Array()
    for (var i=0; i<data0.x.length; i++){
        data.push([i, data0.y[i], data0.x0[i], data0.x0[i]-data0.x_error[i], data0.x0[i]+data0.x_error[i], data0.y[i]-data0.y_error[i], data0.y[i]+data0.y_error[i]])
    }
    limit.min = Math.min(...data0.x0)-1
    limit.max = Math.max(...data0.x0)+1
    function renderItem(params, api) {
        const group = {
          type: 'group',
          children: []
        };
        let coordDims = ['x', 'y'];
        for (let baseDimIdx = 0; baseDimIdx < 2; baseDimIdx++) {
          let otherDimIdx = 1 - baseDimIdx;
          let encode = params.encode;
          let baseValue = api.value(encode[coordDims[baseDimIdx]][0]);
          let param = [];
          param[baseDimIdx] = baseValue;
          param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][1]);
          let highPoint = api.coord(param);
          param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][2]);
          let lowPoint = api.coord(param);
          let halfWidth = 5;
          var style = api.style({
            stroke: api.visual('color'),
            fill: undefined
          });
          group.children.push(
            {
              type: 'line',
              transition: ['shape'],
              shape: makeShape(
                baseDimIdx,
                highPoint[baseDimIdx] - halfWidth,
                highPoint[otherDimIdx],
                highPoint[baseDimIdx] + halfWidth,
                highPoint[otherDimIdx]
              ),
              style: style
            },
            {
              type: 'line',
              transition: ['shape'],
              shape: makeShape(
                baseDimIdx,
                highPoint[baseDimIdx],
                highPoint[otherDimIdx],
                lowPoint[baseDimIdx],
                lowPoint[otherDimIdx]
              ),
              style: style
            },
            {
              type: 'line',
              transition: ['shape'],
              shape: makeShape(
                baseDimIdx,
                lowPoint[baseDimIdx] - halfWidth,
                lowPoint[otherDimIdx],
                lowPoint[baseDimIdx] + halfWidth,
                lowPoint[otherDimIdx]
              ),
              style: style
            }
          );
        }
        function makeShape(baseDimIdx, base1, value1, base2, value2) {
          var shape = {};
          shape[coordDims[baseDimIdx] + '1'] = base1;
          shape[coordDims[1 - baseDimIdx] + '1'] = value1;
          shape[coordDims[baseDimIdx] + '2'] = base2;
          shape[coordDims[1 - baseDimIdx] + '2'] = value2;
          return shape;
        }
        return group;
      }
      var option = {
        tooltip: {},
        legend: {
          data: ['bar', 'error']
        },
        dataZoom: [
          {
            type: 'slider'
          },
          {
            type: 'inside'
          }
        ],
        grid: {
          bottom: 80
        },
        xAxis: {},
        yAxis: {},
        series: [
          {
            type: 'scatter',
            name: 'error',
            data: data,
            dimensions: dimensions,
            encode: {
              x: 2,
              y: 1,
              tooltip: [2, 1, 3, 4, 5, 6],
              itemName: 0
            },
            itemStyle: {
              color: '#77bef7'
            }
          },
          {
            type: 'custom',
            name: 'error',
            renderItem: renderItem,
            dimensions: dimensions,
            encode: {
              x: [2, 3, 4],
              y: [1, 5, 6],
              tooltip: [2, 1, 3, 4, 5, 6],
              itemName: 0
            },
            data: data,
            z: 100
          }
        ]
      };
      mychart.setOption(option);
}


function getBasicData(callback){
  var i=0
  var path = './z='+z[i]+'.json'
  console.log(path)
  fetch(path).then((res)=>{if (!res.ok) {
      throw new Error
          (`HTTP error! Status: ${res.status}`);
  }
  return res.json();
  }).then((data0)=>{
      console.log(data0)
      callback(data0)
  }).catch((err)=>{
      console.log(err)
  })
}

function displayBasicData(data0){
  // var data0 = getRandomData()
  var mychart = echarts.init(document.getElementById('main'));
  const dimensions = [
      'name', 'number', 'M', 'M min', 'M max', 'number min', 'number max'
  ];
  var data = new Array()
  limit.min = Math.min(...data0.x0)-1
  limit.max = Math.max(...data0.x0)+1
  for (var i=0; i<data0.x.length; i++){
      data.push([i, data0.y[i], data0.x0[i], data0.x0[i]-data0.x_error[i], data0.x0[i]+data0.x_error[i], data0.y[i]-data0.y_error[i], data0.y[i]+data0.y_error[i]])
  }
  function renderItem(params, api) {
      const group = {
        type: 'group',
        children: []
      };
      let coordDims = ['x', 'y'];
      for (let baseDimIdx = 0; baseDimIdx < 2; baseDimIdx++) {
        let otherDimIdx = 1 - baseDimIdx;
        let encode = params.encode;
        let baseValue = api.value(encode[coordDims[baseDimIdx]][0]);
        let param = [];
        param[baseDimIdx] = baseValue;
        param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][1]);
        let highPoint = api.coord(param);
        param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][2]);
        let lowPoint = api.coord(param);
        let halfWidth = 5;
        var style = api.style({
          stroke: api.visual('color'),
          fill: undefined
        });
        group.children.push(
          {
            type: 'line',
            transition: ['shape'],
            shape: makeShape(
              baseDimIdx,
              highPoint[baseDimIdx] - halfWidth,
              highPoint[otherDimIdx],
              highPoint[baseDimIdx] + halfWidth,
              highPoint[otherDimIdx]
            ),
            style: style
          },
          {
            type: 'line',
            transition: ['shape'],
            shape: makeShape(
              baseDimIdx,
              highPoint[baseDimIdx],
              highPoint[otherDimIdx],
              lowPoint[baseDimIdx],
              lowPoint[otherDimIdx]
            ),
            style: style
          },
          {
            type: 'line',
            transition: ['shape'],
            shape: makeShape(
              baseDimIdx,
              lowPoint[baseDimIdx] - halfWidth,
              lowPoint[otherDimIdx],
              lowPoint[baseDimIdx] + halfWidth,
              lowPoint[otherDimIdx]
            ),
            style: style
          }
        );
      }
      function makeShape(baseDimIdx, base1, value1, base2, value2) {
        var shape = {};
        shape[coordDims[baseDimIdx] + '1'] = base1;
        shape[coordDims[1 - baseDimIdx] + '1'] = value1;
        shape[coordDims[baseDimIdx] + '2'] = base2;
        shape[coordDims[1 - baseDimIdx] + '2'] = value2;
        return shape;
      }
      return group;
    }
    var option = {
      tooltip: {},
      legend: {
        data: ['bar', 'error']
      },
      dataZoom: [
        {
          type: 'slider'
        },
        {
          type: 'inside'
        }
      ],
      grid: {
        bottom: 80
      },
      xAxis: {},
      yAxis: {},
      series: [
        {
          type: 'scatter',
          name: 'error',
          data: data,
          dimensions: dimensions,
          encode: {
            x: 2,
            y: 1,
            tooltip: [2, 1, 3, 4, 5, 6],
            itemName: 0
          },
          itemStyle: {
            color: '#77bef7'
          }
        },
        {
          type: 'custom',
          name: 'error',
          renderItem: renderItem,
          dimensions: dimensions,
          encode: {
            x: [2, 3, 4],
            y: [1, 5, 6],
            tooltip: [2, 1, 3, 4, 5, 6],
            itemName: 0
          },
          data: data,
          z: 100
        }
      ]
    };
    mychart.setOption(option);
}

function recordClickPosition(callback) {
  determinator = 1
  var mychart = echarts.getInstanceByDom(document.getElementById('main'));
  mychart.getZr().on('click', function click_a(params) {
    var point = [params.offsetX, params.offsetY];
    point = mychart.convertFromPixel('grid', point);
    callback(point)
    // Add your logic here to record the click position
  });
}

function generateGaussian(point){
  if (determinator != 1){
    return
  }
  var gauss_number = gaussians.series.length
  gaussians.add_element(point[0], 3, point[1])
  console.log(gaussians)
  displayGaussian(gaussians, gauss_number)
  mychart.getZr().off('click');
}

function displayGaussian(gaussian_series, number){
  var mychart = echarts.getInstanceByDom(document.getElementById('main'));
  var option = mychart.getOption();
  var x = new Array()
  var y = new Array()
  var y0 = new Array()
  var xy=new Array()
  var step = (limit.max-limit.min)/200
  for (var i=0; i<=(limit.max-limit.min); i+=step){
    x.push(limit.min+i)
  }
  for (var i=0; i<x.length; i++){
    y0.push(gaussians.pdf(x[i]))
  }
  var xy0 = new Array()
  for (var i=0; i<x.length; i++){
    xy0.push([x[i],y0[i]])
  }
  for (var i=0; i<gaussian_series.series.length; i++){
    var y1 = new Array()
    for (var j=0; j<x.length; j++){
      y1.push(gaussian_series.series[i].pdf(x[j]))
    }
    y.push(y1)
  }
  for (var i=0; i<gaussian_series.series.length; i++){
    var xy1 = new Array()
    for (var j=0; j<x.length; j++){
      xy1.push([x[j],y[i][j]])
    }
    xy.push(xy1)
  }
  var gauss_option = new Array()
  if (number != 0){
    var option_length = option.series.length
    option.series.splice(option_length-number-1, number+1)
  }

  for (var i=0; i<gaussian_series.series.length; i++){
    gauss_option.push({
      data: xy[i],
      type: 'line',
      index: i+1,
      smooth: true,
      xAxisIndex: 0, // Use the first x-axis
      symbol: 'none',
      itemStyle: {
        color: 'green'
      }
    })
  }
  gauss_option.push({
    data: xy0,
    type: 'line',
    smooth: true,
    index: 0,
    //xAxisIndex: 0, // Use the first x-axis
    symbol: 'none',
    itemStyle: {
      color: 'red'
    }
  })
  option.series.push(...gauss_option)
  mychart.setOption(option);
}

function select_line(callback){
  determinator = 2
  var mychart = echarts.getInstanceByDom(document.getElementById('main'));
  mychart.getZr().on('click', function(params) {
    callback(params)
  });
  mychart.off('click');
}

function test(params){
  if (determinator != 2){
    return
  }
  var keys = Object.keys(params.target)
  var effect_keys = new Array()
  for (let k in keys){
    if (keys[k].includes('__ec_inner_')) { 
      effect_keys.push(keys[k])
    }
  }
  var effect_key = effect_keys[0]
  if (effect_keys[1] < effect_keys[0]){
    effect_key = effect_keys[1]
  }
  console.log(params.target[effect_key].seriesIndex)
}

function refresh(){
  determinator = 0
}