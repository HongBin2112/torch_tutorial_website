

const part1_url = "https://api.github.com/repos/DongDong-Zoez/pytorchAI/contents/torch?ref=main";
const part2_url = "https://api.github.com/repos/DongDong-Zoez/pytorchAI/contents/CNN?ref=main";


print_part_content_on_page(part1_url, "github_part1_content");
print_part_content_on_page(part2_url, "github_part2_content");












function print_part_content_on_page(github_api_url, element_id){

	const content_part_box_element = document.getElementById(element_id);

	fetch_file_to_json(github_api_url).then((json_obj) => {

		let table_of_contents = table_of_contents_json_analysis(json_obj);

		for(let num_section=0; num_section < table_of_contents.length; num_section++){
			let section_data = table_of_contents[num_section];
			
			let section_name = section_data[0].slice(0, section_data[0].indexOf('.ipynb'));
			let promise_section_html_content = trans_ipynb_to_html(section_data[1]);
			let click_event = "click_change_display('" + section_name + "')";
			
			promise_section_html_content.then(
				(html_content) => {
					let text_box = gene_content_info_box(element_id, section_name, html_content, click_event);
					content_part_box_element.innerHTML += text_box;
				}
			)

		}
		
	})
	
}


function gene_content_info_box(part, section, html_content, onclick_event){
	// html code template define.
	
	let content_info_box_template = [
		"<div class=\"content_info_box\" onclick=\"" + onclick_event + "\">", 
			"<p class=\"content_info_text_title\">► " + section + "</p>" +"\n",
		  	"<div class=\"content_info_text\" id=\"" + section + "\">",
			  	"<hr>",
				html_content,
			"</div>",
		"</div>"
	]
	return content_info_box_template.join("\n");
}



function fetch_file_to_json(github_api_url) {

	const headers = new Headers();
	headers.append('Accept', 'application/vnd.github.v3+json');
	
	let promise_result;
	
	promise_result = fetch(github_api_url, {
		method: "GET",
		headers: headers
	})
	.then((response) => {		
		return response.json();
	})
	.catch((error) => {
		console.log(`Error: ${error}`);
	})
	
	return promise_result;
}


function trans_ipynb_to_html(dl_url){

	let promise_html_content;

	promise_html_content = fetch_file_to_json(dl_url).then((json_obj) => {
		let contents = ipynb_json_analysis(json_obj);
		let html_contents = trans_contents_to_html(contents);

		return html_contents.join("");
	})
	.catch((error) => {
		console.log(`Error: ${error}`);
	})

	return promise_html_content;
}





function table_of_contents_json_analysis(json_obj){
	// return 2-dim str array. 
	// [0]:file_name, [1]:file_download_url 

	let names_and_urls = [];

	for(let i=0; i<json_obj.length; i++){
		let name = json_obj[i].name;
		let dl_url = json_obj[i].download_url;

		names_and_urls.push([name, dl_url])
	}
	return names_and_urls;
}





function ipynb_json_analysis(json_obj){
	// This function will extract only two elements(return 2-dim array).
	// [0]:type(string), There are 2 types, "markdown" and "code".
	// [1]:text(string array)

	const raw_contents = json_obj.cells;
	const num_contents = raw_contents.length;
	
	var contents = [];
	
	for(let i = 0; i<num_contents; i++){
		let type = raw_contents[i].cell_type;
		let texts = raw_contents[i].source;
		contents.push([type, texts]);
	}
	
	return contents;
}



function trans_contents_to_html(contents){

	var html_contents = [];
	const code_box_tag = "<div class=\"content_info_text_code_box\">\n";

	for(let i=0; i<contents.length; i++){
		let type = contents[i][0];
		let texts = contents[i][1];

		if(type === "markdown"){
			let tagged_texts = str_arr_add_html_tag(texts);
			html_contents.push(tagged_texts.join(""));
		} 
		else if(type === "code"){
			let tagged_code = texts;

			tagged_code.splice(0, 0, (code_box_tag + "\n<pre>\n<code>\n"));
			tagged_code.push("\n</code>\n</pre>\n</div>\n<br>");
			
			html_contents.push(tagged_code.join(""));
		}
	}

	return html_contents;
}



function str_add_html_tag(s){

	let tag = "h0";
	let slice_s = "";
	let tagged_str = "";

	var indexes_of_sharps = [
		s.indexOf("#"),
		s.indexOf("##"),
		s.indexOf("###"),
		s.indexOf("####"),
		s.indexOf("#####"),
		s.indexOf("######")
	]

	for(let i=0; i<(indexes_of_sharps.length); i++){
		if(indexes_of_sharps[i] != -1) { 
			tag = "h" + (i+1); 
			slice_s = s.slice(indexes_of_sharps[i]+(i+1)); //i+1 to skip char "#"
		}
	}
	
	var remove_newline_char = function(str){
		let char_n_position = str.indexOf('\n');
		if(char_n_position != -1) return str.slice(0, char_n_position+1);
		else return str;
	}
	
	slice_s = remove_newline_char(slice_s);

	if(tag != "h0")	
	{ tagged_str = "<br>\n<"+tag+">" + slice_s +"</"+tag+">"; }
	else 
	{ 
		let temp_s = remove_newline_char(s);
		tagged_str = "<p>" + temp_s +"</p>"; 
	}


	return tagged_str + '\n';
}




function str_arr_add_html_tag(str_arr){

	let result_arr = str_arr;

	for(let i=0; i < str_arr.length; i++){
		if(str_arr[i] !== '\n'){
			result_arr[i] = str_add_html_tag(str_arr[i]);
		}
	}

	return result_arr;
}




