//This function loads the website initially with the complete table of data
function initiate_table(){
    //select the table body
    var tbody = d3.select('tbody');
    //iterate through objects in data
    data.forEach(function(sighting){
        //append a row
        new_row = tbody.append("tr");
        Object.entries(sighting).forEach(function([key,value]){
            //append values
            new_row.append("td").text(value);
        });
    });
};

initiate_table();

//This function filters the table according to a user specified date input
function filter_table(date_input){

    var tbody = d3.select('tbody');
    //remove all rows of data currently in table
    tbody.selectAll("tr").remove();
    data.forEach(function(sighting){
        //only appends rows if date is the same as that which wa sspecified by the user.
        if(date_input == sighting.datetime){
            new_row = tbody.append("tr");
            Object.entries(sighting).forEach(function([key,value]){
                new_row.append("td").text(value)
            });

        }

    });
};
//select filter button and input field
var filter_button = d3.select('#filter-btn')
var input_date = d3.select('.form-control')

filter_button.on("click",function(){
    //Prevent refresh of page upon click
    d3.event.preventDefault();   
    console.log("clicked")
    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#datetime");
    // Get the value property of the input element
    var input_date = inputElement.property("value");
    //call the filter table function
    if (input_date !== ""){
        filter_table(input_date);
    }else{
        initiate_table();
    }
    
});