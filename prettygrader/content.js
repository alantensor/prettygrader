function get_text_tree(allText) {
  grades_start = allText.indexOf("AUTOGRADING GRADE:");
  grades_end = allText.indexOf("Internal use only below here:");
  mb = allText.substring(grades_start, grades_end);

  reg_grades = /^\s*\d*\.?\d*%\s*of\s*\d*\.?\d%\s\s.\s/gm;
  reg_total = /AUTOGRADING GRADE:\s*\d*\s*\(out of \d*\)\s*/;

  mb = mb.replace(reg_total, "");
  mb = mb.replace(reg_grades, "");
  mb = mb.trim();

  return mb;
}

function get_grades(allText){
  reg_grades = /^\s{1,4}\d*\.?\d*%\s*of\s*\d*\.?\d%\s\s.\s/gm
  return allText.match(reg_grades);
}

function styleProblem(p, text){
  p.style.fontSize = "1.3rem";
  p.style.padding = "10px";
  p.style.borderRadius = "10px";
  p.style.fontWeight = "900"

  if(text.includes("correct")){
    p.style.color = "white";
    p.style.backgroundColor = "#86B049";

  } else {
    p.style.color = "white";
    p.style.backgroundColor = "tomato";
  }
}

function styleStuff(p, text){
  if(text.includes("incorrect")){
    p.style.color = "tomato";
    p.style.backgroundColor = "yellow"
  } else if(text.includes("correct")){
    p.style.color = "#86B049";
  } else{
    p.style.color = "tomato";
  }
}



fetch(window.location.href)
  .then((res) => res.text())
  .then((text) => {
    if (
        window.location.href.substring((window.location.href.length - 3), window.location.href.length )
=== "txt"
        ) {

      //isolate grading section (without grades)
      text_tree = get_text_tree(text);
            
      //clear all autograder text      
      document.body.innerText = "";

      //insert content div
      content = document.createElement("div");
      content.classList.add("content");
      document.body.appendChild(content);

      //For each line, store leading spaces and text

      array = [];
      grades = get_grades(text);
      console.log(grades)

      text_tree.split("\n").forEach((line) => {
        count = 0;
        for (i = 0; i < line.length; i++) {
          if (line[i] == " ") count++;
          else break;
        }
        array.push([count, line]);
      });

      //Rank elements in array according to # of leading spaces
      //1 = least spaces, 2, 3, ..., n = most spaces

      temp = [];
      array.forEach((group) => {
        temp.push(group[0]);
      });

      key = temp.filter((value, index, arr) => {
        return arr.indexOf(value) === index;
      });

      //Add elements to DOM
      console.log(array)
      console.log(key)
      let curr = 1, c = 0
      array.forEach((group, index) => { //group = [# of spaces, text]
        rank = key.indexOf(group[0])
        if(rank == 1){ //if current is problem
          curr = index;
          c++;
          div = document.createElement("div");
          div.classList.add("s" + rank.toString())
          div.classList.add(index.toString());
          p = document.createElement("p") 
          p.id = "problem"+c.toString()
          p.innerText = group[1];

          styleProblem(p, group[1]);
          div.appendChild(p)
          content.appendChild(div);

        } else if(rank != 0){
            p = document.createElement("p")
            p.classList.add("s" + rank.toString())
            p.classList.add(index.toString());
            p.innerText = group[1];

            styleStuff(p, group[1])

            str = "s1 "+curr.toString(); //get corresponding problem
            div = document.getElementsByClassName(str); 
            
            div[0].appendChild(p)
        }
      });
      //create menu

      menu = document.createElement("div")
      menu.classList.add("sidebar")

      document.body.appendChild(menu)

    }
  });


