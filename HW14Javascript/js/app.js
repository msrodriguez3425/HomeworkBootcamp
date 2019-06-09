var tbody = d3.select('tbody');
data.forEach(function(sighting){
    new_row = tbody.append("tr")
    Object.entries(sighting).forEach(function([key,value]){
        new_row.append("td").text(value);
    });
});

var filter_button = d3.select('#filter-btn')
var input_date = d3.select('.form-control')
filter_button.on("click",function(){
    var new_text = d3.event.target.value;
    d3.event.preventDefault();   
    console.log("clicked")
    console.log(new_text)
});