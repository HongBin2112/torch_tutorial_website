



const cards_id = ["part1_card", "part2_card", "part3_card"];
const contents_id = ["part1_content", "part2_content", "part3_content"];

let dict_cards_id = {};
for(var i = 0; i < cards_id.length; i++){
  dict_cards_id[cards_id[i]] = contents_id[i];

  //put onclick event to html.
  document.getElementById(cards_id[i]).onclick = click_card_show_info;
}



function click_change_display(element_id){
    var x = document.getElementById(element_id);

    if (x.style.visibility === "visible") {
      x.style.visibility = "hidden";
      x.style.opacity = "0";
      x.style.maxHeight = null;
      
    } else {
      x.style.display = "block";
      x.style.visibility = "visible";
      x.style.opacity = "1";
      //This is the keypoint: smoothly expand the content.
      x.style.maxHeight = x.scrollHeight + "px"; 
    }    
}



function click_card_show_info(){

  var card_id = this.id;
  var content_id = dict_cards_id[card_id];


  for(i = 0; i < cards_id.length; i++){
    var i_content_id = dict_cards_id[cards_id[i]];
    var i_content_element = document.getElementById(i_content_id);
    
    if(i_content_id != content_id){
      i_content_element.style.maxHeight = null;
      i_content_element.style.display = "none";
      i_content_element.style.visibility = "hidden";
  
    } else {
      click_change_display(content_id);
      
    }

  }

  //After info shows, click anchor<a> under content_title_box to move.
  var info_title_anchor = document.getElementById(content_id).getElementsByTagName("a")[0];
  setTimeout(function() {
    info_title_anchor.click();
  }, 260);


}












/* DEBUG */
var debug_mode = 0;

if(debug_mode == 1){
  console.log("debug...");

  
}

