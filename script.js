let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req = new XMLHttpRequest()

let data
let values = []

let xScale
let yScale
let xAxisScale
let yAxisScale
let xAxis
let yAxis

let width = 600;
let height = 400;
let padding = 40;

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
  svg.attr('width', width)
  svg.attr('height', height)
}
let generateScales = () => {
  xScale = d3.scaleLinear()
             .domain([d3.min(values, (d) =>{
               return d['Year'] - 1
             }), d3.max(values, (d) =>{
               return d['Year'] + 1
             })])
             .range([padding, width - padding])

  yScale = d3.scaleTime()
             .domain([d3.min(values, (d) => {
               return new Date(d['Seconds'] * 1000)
             }), d3.max(values, (d) => {
               return new Date(d['Seconds'] * 1000)
             })])
             .range([padding, height - padding])

let dateArray = new Date(values[1])

  /*xAxisScale = d3.scaleLinear()
                 .domain([d3.min(values, (d) => d[1]), d3.max(values, (d) => d[1])])
                 .range([padding, width - padding])

  yAxisScale = d3.scaleTime()
                 .domain([0, d3.max(dateArray)])
                 .range([height - padding, padding])*/
}

let drawPoints = () => {
  svg.selectAll('circle')
     .data(values)
     .enter()
     .append('circle')
     .attr('cx', (d) => xScale(d['Year']))
     .attr('cy', (d) =>{
       return yScale(new Date(d['Seconds'] * 1000))
     })
     .attr('r', 5)
     .attr('class','dot')
     .attr('data-xvalue', (d) => {
       return d['Year']
     })
     .attr('data-yvalue', (d) => {
       return new Date(d['Seconds'] * 1000)
     })
     .attr('fill', (d) => {
       if(d['Doping'] != ''){
         return 'orange'
       } else {
         return 'lightgreen'
       }
     })
     .on('mouseover', (d) => {
       tooltip.transition()
              .style('visibility', 'visible')

      if(d['Doping'] != ''){
        tooltip.text(d['Year'] + '-' + d['Name'] + '-' + d['Time'] + '-' + d['Doping'])
      }  else {
        tooltip.text(d['Year'] + '-' + d['Name'] + '-' + d['Time'] + '-' + 'No Allogations')
      }
      tooltip.attr('data-year', d['Year'])
    })
      .on('mouseout', (d) => {
        tooltip.transition()
               .style('visibility', 'hidden')
      })
}

let generateAxis = () => {
  xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format('d'))
  yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat('%M:%S'))

  svg.append('g')
     .call(xAxis)
     .attr('id', 'x-axis')
     .attr('transform', 'translate(0, '+ (height - padding) + ')')

 svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate('+ padding + ', 0)')
}

req.open('GET', url, true)
req.onload = () => {
  values = JSON.parse(req.responseText)
  console.log(values)
  drawCanvas()
  generateScales()
  drawPoints()
  generateAxis()
}
req.send()
