import React from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useNavigate } from 'react-router-dom';

export default function PieChart({ galaCount, showPieChart }) {
  const navigate = useNavigate()

  if (showPieChart === true) {
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create("chartdiv", am4charts.PieChart3D);
    // console.log(chart);
    if (chart.logo) {
      chart.logo.disabled = true
    }

    // Let's cut a hole in our Pie chart the size of 40% the radius
    chart.innerRadius = am4core.percent(40);
    // console.log(galaCount,"galaCount");
    // chart.data = [{
    //   "country": "Lithuania",
    //   "litres": 501.9
    // }, {
    //   "country": "Czechia",
    //   "litres": 301.9
    // }, {
    //   "country": "Ireland",
    //   "litres": 201.1
    // }, {
    //   "country": "Germany",
    //   "litres": 165.8
    // }, {
    //   "country": "Australia",
    //   "litres": 139.9
    // }, {
    //   "country": "Austria",
    //   "litres": 128.3
    // }, {
    //   "country": "UK",
    //   "litres": 99
    // }, {
    //   "country": "Belgium",
    //   "litres": 60
    // }, {
    //   "country": "The Netherlands",
    //   "litres": 50
    // }];

    chart.data = galaCount;
    // console.log(chart.data,24);

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries3D());
    pieSeries.dataFields.value = "gala_count";
    pieSeries.dataFields.category = "month_year_name";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 1;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.labels.template.text = "{category}";
    pieSeries.slices.template.tooltipText = "{category}: Gala Count : {value.value}";
    pieSeries.colors.list = [
      am4core.color('rgba(255, 99, 132, 0.5)'),
      am4core.color('rgba(54, 162, 235, 0.5)'),
      am4core.color("rgba(255, 206, 86, 0.5)"),
      am4core.color("rgba(75, 192, 192, 0.5)"),
      am4core.color('rgba(153, 102, 255, 0.5)'),
      am4core.color('rgba(255, 159, 64, 0.5)'),
      am4core.color('rgb(152, 223, 88)'),
      am4core.color('rgb(249, 221, 81)'),
      am4core.color('rgb(236, 100, 100)'),
      am4core.color('rgb(36, 220, 212)'),
      am4core.color('rgb(236, 100, 165)'),
      am4core.color('rgb(48, 144, 240)'),

    ];

    function myFunction(ev) {
      // console.log("clicked on ", ev.target.tooltipDataItem.dataContext.month_year_name);
      let path = ev.target.tooltipDataItem.dataContext.month_year_name
      path = path.split(", ")
      navigate(`/gala_area_details/${path[0]}/${path[1]}`)
    }
    pieSeries.slices.template.events.on("hit", myFunction, this);

    // Disable sliding out of slices
    pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
    pieSeries.slices.template.states.getKey("hover").properties.scale = 1.1;
  }
  return (
    <>
      <div id="chartdiv"></div>
    </>
  )
}

