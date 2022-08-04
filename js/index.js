



function click_change_display(element_id){
    var x = document.getElementById(element_id);

    /*
    if (x.style.display === "none") {
        x.style.display = "block";
        x.style.opacity = "1";
      } else {
        x.style.display = "none";
        x.style.opacity = "0.3";
      }
      */

    if (x.style.visibility === "visible") {
      x.style.visibility = "hidden";
      //x.style.display = "none";
      x.style.opacity = "0.1";
    } else {
      x.style.visibility = "visible";
      x.style.display = "block";
      x.style.opacity = "1";
    }    
}


function card_click_show_info(card_id){
    
}




/* DEBUG */

