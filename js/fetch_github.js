

let ta_url = "https://raw.githubusercontent.com/DongDong-Zoez/pytorchAI/main/torch/Variable.ipynb";
ta_url= "https://api.github.com/repos/DongDong-Zoez/pytorchAI/contents/torch?ref=main";


print_part_content_on_page(ta_url, "part1_content");



function print_part_content_on_page(github_api_url, element_id){

	const content_element = document.getElementById(element_id);
	const content_info_text_elements = content_element.getElementsByClassName("content_info_text");
	
	console.log(content_info_text_elements[0]);

	fetch_file_to_json(github_api_url).then((json_obj) => {

		let table_of_contents = table_of_contents_json_analysis(json_obj);

		test = table_of_contents[0];
		console.log(test[0], test[1]);
		let promise_html_content = trans_ipynb_to_html(test[0], test[1]);

		promise_html_content.then((html_content)=> {
			content_info_text_elements[0].innerHTML = html_content;
		})
		
	})
	
}



function trans_ipynb_to_html(name, dl_url){

	let promise_html_content;
	// Add title
	let title = name.slice(0, name.indexOf('.ipynb'));
	title = "<p class=\"content_info_text_title\">- " + title + "</p>" +"\n\n";

	promise_html_content = fetch_file_to_json(dl_url).then((json_obj) => {
		let contents = ipynb_json_analysis(json_obj);
		let html_contents = trans_contents_to_html(contents);

		let html_content = title + html_contents.join("");

		return html_content;
	})
	.catch((error) => {
		console.log(`Error: ${error}`);
	})

	return promise_html_content;
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



function table_of_contents_json_analysis(json_obj){
	//(return 2-dim str array).

	let names_and_urls = [];

	for(let i=0; i<json_obj.length; i++){
		var name = json_obj[i].name;
		var dl_url = json_obj[i].download_url;

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
	
	let contents = [];
	
	for(let i = 0; i<num_contents; i++){
		var type = raw_contents[i].cell_type;
		var texts = raw_contents[i].source;
		contents.push([type, texts]);
	}
	
	return contents;
}



function trans_contents_to_html(contents){

	let html_contents = [];

	for(let i=0; i<contents.length; i++){
		var type = contents[i][0];
		var texts = contents[i][1];

		if(type === "markdown"){
			var tagged_texts = str_arr_add_html_tag(texts);
			html_contents.push(tagged_texts.join(""));
		} 
		else if(type === "code"){
			html_contents.push("\nhere is code\n");
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
	
	
	slice_s = slice_s.slice(0, slice_s.indexOf('\n'));  //remove '\n'

	if(tag != "h0")	
	{ tagged_str = "<"+tag+">" + slice_s +"</"+tag+">"; }
	else 
	{ 
		let temp_s = s.slice(0, s.indexOf('\n'));
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




