$(document).ready(function(){
    $('td').click(function(event){
        select_cell(event.target.id);
    }
		 );
    $.each(rdftypes,function(name,value){
	$("#rdf-type")
            .append($("<option></option>")
            .attr("value",name)
	    .text(name));
    });
    $("#rdf-type").change(function(event){
	var coloptions, type;
	type = rdftypes[$(this).val()];
	update_for_type(type);
    });
    update_for_type(rdftypes[$("#rdf-type").val()]);

});


var rdftypes = {
	displaced:
		{attributes:
			["hhCount","PersonCount","source","origin"],
		children:
			["idp","refugee","others"]
		}
	,
	distribution:
		{attributes:	
			["blanketsProvided","bucketsProvided","cotsProvided","familyTentsProvided","jerryCansProvided","kitchenSetsProvided","largeTentsProvided","matsProvided","mosquitoNetsProvided","nonFoodItemsProvided","ropeProvided","sheetsProvided","tarpaulinProvided","tentsProvided","waterFiltersProvided"]
		}
	
}
		
var rdflabels= {
	displaced:"Displaced People",
	hhCount:"Number of Households",
	personCount:"Number of People",
	source:"Data Source",
	origin:"Location of Origin",
	idp:"Internally Displaced",
	refugee:"Refugees",
	others:"Others of Concern",
	blanketsProvided:"Blankets Provided",
	bucketsProvided:"Buckets Provided",
	cotsProvided:"Cots Provided",
	familyTentsProvided:"Family Tents Provided",
	jerryCansProvided:"Jerry Cans Provided",
	kitchenSetsProvided:"Kitchen Sets Provided",
	largeTentsProvided:"Large Tents Provided",
	matsProvided:"Mats Provided",
	mosquitoNetsProvided:"Mosquito Nets Provided",
	nonFoodItemsProvided:"Non-Food Items Provided",
	ropeProvided:"Rope Provided",
	sheetsProvided:"Sheets Provided",
	tarpaulinProvided:"Tarpaulins Provided",
	tentsProvided:"Tents Provided",
	waterFiltersProvided:"Water Filters Provided"
}

var currently_selecting = false;
var selected_from = 0;
var selected_to = 0;

function build_output(){
    var selection;
    output = [];
    headers = $("th").map(
	function(i,e){return $('select',e).val();});
    if(!currently_selecting && selected_to != 0){
	selection = selection_range(selected_from, selected_to);
        foreach_cell(selected_from, selected_to, function(cell){
            var row, col;
	    row = cell.data().row - selection.rowmin;
            col = cell.data().col - selection.colmin;
            output[row] = output[row] || [];
            output[row][col] = output[row][col] || {};
	    output[row][col].row = row;
	    output[row][col].col = col;
	    output[row][col].header = headers[cell.data().col];
	    output[row][col].value = cell.data('value');
        });
    }
    return output;
}

function update_for_type(type){
    var coloptions;
    coloptions = type.attributes;
    if("children" in type){
	coloptions = coloptions.concat(type.children);
    }
    update_columns(coloptions);
}

function update_columns(coloptions){
	$("th > select > option").remove();
	$("th > select").append($("<option></option>")
			.attr("value","ignore")
			.text("-"));
	$.each(coloptions,function(index,value){
	    $("th > select")
		.append($("<option></option>")
			.attr("value",value)
			.text(value));
	});
}

function select_cell(id){
    if(!currently_selecting){
        selected_from = id;
        selected_to = 0;              
        $("td").removeClass("selected-cells");
        $("#"+id).addClass("selected-cells");
	currently_selecting = true;
    }else{
        var from, to, i, imin, imax, j, jmin, jmax;
        selected_to = id;              
        foreach_cell(selected_from, selected_to, function(cell){
            cell.addClass('selected-cells');
        });
        alert('The greyed cell will now be imported into HXL');
	currently_selecting = false;
    }
}

function foreach_cell(from_id, to_id, callback){
    var r = selection_range(from_id,to_id);
    for(var i=r.rowmin; i<r.rowmax; i++){ 
        for(var j=r.colmin; j<r.colmax; j++){ 
	    callback( $("#"+i+"-"+j));
        }
    }
}

function selection_range(from_id,to_id){
    from = from_id.split('-');
    to = to_id.split('-');
    return {rowmin : Math.min(parseInt(from[0],10),parseInt(to[0],10)),
	    rowmax:  Math.max(parseInt(from[0],10),parseInt(to[0],10))+1,
	    colmin: Math.min(parseInt(from[1],10),parseInt(to[1],10)),
	    colmax:  Math.max(parseInt(from[1],10),parseInt(to[1],10))+1}

}